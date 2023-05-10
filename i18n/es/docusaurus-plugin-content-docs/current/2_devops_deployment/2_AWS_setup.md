# Motor ethereal en AWS

## Crear clúster de EKS

Primero debe configurar un clúster eks para que Ethereal Engine se ejecute.
Si bien esto se puede hacer a través de la interfaz web de AWS, el `eksctl` CLI
aprovisionará automáticamente más de los servicios que necesita automáticamente,
y por lo tanto se recomienda.

Primero, siga [Estas instrucciones](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)
para configurar aws-cli, eksctl y configurar aws-cli con sus credenciales de AWS.
También debe configurar kubectl y Helm, ya que lo usaremos para instalar múltiples bases de código desde Charts.

A continuación, ejecute el siguiente comando:

`eksctl create cluster --name <name> --version <version> --region <region> --managed --nodegroup-name <name> --node-type <instance type> --nodes <target_node_number> --nodes-min <minimum_node_number> --nodes-max <maximum_node_number>`

Esto creará un clúster de EKS con nodos administrados en la región especificada, incluso automáticamente
crear subredes, crear una VPC y mucho más. Puede tardar hasta 15 minutos en completarse.

También puedes usar la bandera `--zones <zone1>,<zone2>` Para especificar qué zonas de disponibilidad del clúster
debe instalarse en. Algunas regiones tienen zonas que no están disponibles, pero que eksctl intentará
use si --zones no se especifica, lo que lleva a que la configuración falle. Como ejemplo, us-west-1 (a partir de esto)
writing) no tiene ningún recurso disponible en us-west-1b; si se está instalando en us-west-1,
usted querría usar `--zones us-west-1a,us-west-1c`.

Tenga en cuenta que la región es importante para casi todos los servicios de AWS. La región predeterminada es 'us-east-1',
pero si crea el clúster en cualquier otra región, deberá asegurarse de que está creando certificados,
Registros DNS, etc. en la misma región.

Al momento de escribir este artículo, la API y el cliente están configurados para ejecutarse en un grupo de nodos denominado 'ng-1'.
Si le asigna otro nombre, asegúrese de cambiar nodeAffinity en el archivo de configuración.

Asegúrese de aumentar el límite máximo de nodos, ya que de forma predeterminada el destino, el mínimo y el máximo son
establecido en 2, y la configuración de Ethereal Engine definitivamente necesitará más de dos nodos si ha configurado
utilizan tipos de instancia relativamente pequeños como t3a.medium.

#### Instalar Cluster Autoscaler (opcional)

Si bien no es necesario, puede ser útil tener un escalador automático instalado en el clúster para aumentar
el número de nodos disponibles para los pods cuando el clúster tiene mucho tráfico y para disminuirlo
número cuando tiene poco tráfico.

Seguir [Estas instrucciones](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html#cluster-autoscaler)
para configurar el escalador automático. Cualquier grupo de nodos administrados creado en los pasos siguientes debe ser de forma predeterminada
etiquetado de tal manera que el escalador automático pueda controlarlos, por lo que no se debe requerir ninguna otra acción.

Tenga en cuenta que hay cierto tiempo de retraso en la ampliación hacia arriba y hacia abajo. Generalmente toma alrededor de 5 minutos desde
el tiempo que el escalador automático ve la necesidad de agregar más nodos antes de que esos nodos se hayan activado,
se ha instalado la imagen de Docker adecuada en ellos y están listos para ser utilizados. Se necesita acerca de
15 minutos para que el escalador automático elimine realmente los nodos que se consideran superfluos, como una cobertura contra
el reciente aumento del tráfico se ha recuperado de nuevo.

#### Crear plantilla de lanzamiento

Vaya a EC2 -> Plantillas de lanzamiento y cree una nueva. Llámalo algo así como 'xrengine-production-instanceserver'.
La mayoría de las configuraciones se pueden dejar tal cual, excepto las siguientes:

*   Almacenamiento -> Agregue un volumen, establezca el tamaño en ~ 20 GB y, para Nombre del dispositivo, seleccione '/dev/xvda'.
*   Interfaces de red -> Agregar una y, en 'Asignación automática de IP pública', seleccione 'Habilitar'

#### Crear grupo de nodos para servidores de instancias

Vaya al sitio web de AWS, luego vaya a EKS -> Clusters -> haga clic en el clúster que acaba de crear -> Configuración -> Compute.
Debería ver un grupo de nodos administrados ya allí; al hacer clic en su nombre se abrirá la información
y la edición, aunque no puede cambiar el tipo de instancia después de que se haya realizado.

De vuelta en la pestaña Calcular, haga clic en Agregar grupo de nodos. Elija un nombre (se recomienda algo como ng-instanceservers-1),
Seleccione el rol de IAM que se creó con el clúster (debería ser algo así como `eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>`),
alternar el interruptor Usar plantilla de inicio y seleccionar la plantilla de inicio que realizó en el paso anterior,
y, a continuación, haga clic en Siguiente. En la segunda página, elija los tipos de instancia que desea para el grupo,
establezca los tamaños de escala mínimos/máximos/deseados y pulse Siguiente (se recomienda t3(a).smalls).
Puede haber problemas de conexión con las instancias de instanceserver en subredes privadas, así que elimine todas las instancias privadas
subredes de la lista de subredes que se van a usar y asegúrese de que se están utilizando subredes públicas (a veces
el flujo de trabajo solo selecciona subredes privadas de forma predeterminada). Presiona Siguiente, revisa todo y haz clic en Crear.

### Crear grupo de nodos para redis

Redis debe obtener su propio grupo de nodos para aislarlo de cualquier otro cambio que se pueda realizar en el clúster.
Al igual que con el grupo de nodos instanceserver, no es estrictamente necesario, pero puede evitar que otras cosas
cayendo debido a que los servidores redis se interrumpen.

De vuelta en la pestaña Calcular, haga clic en Agregar grupo de nodos. Elija un nombre (la configuración predeterminada en https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs supone
un nombre de 'NG-Redis-1'), seleccione el rol de IAM que se creó con el clúster
(debería ser algo así como `eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>`),
alternar el interruptor Usar plantilla de inicio y seleccionar la plantilla de inicio utilizada para crear el grupo de nodos inicial,
y, a continuación, haga clic en Siguiente. En la segunda página, elija los tipos de instancia que desea para el grupo,
establezca los tamaños de escala mínimos/máximos/deseados y pulse Siguiente (probablemente pueda salirse con la suya con un solo t3(a).small).
Las subredes predeterminadas deberían estar bien, así que presiona Siguiente, revisa todo y haz clic en Crear.

### Crear grupo de nodos para el constructor

La pila completa de Ethereal Engine necesita un servidor constructor dentro del clúster para agrupar y construir
Ethereal Engine se proyecta en la base de código que se implementará. Esto debería ejecutarse en su propio grupo de nodos
que tiene un solo nodo: solo una copia del constructor debe ejecutarse a la vez, y
debido a las altas necesidades de memoria de la construcción del servicio al cliente, se necesita una caja con >8 GB de RAM.

De vuelta en la pestaña Calcular, haga clic en Agregar grupo de nodos. Elige un nombre (algo así como `ng-dev-builder-1` se recomienda) y
Seleccione el rol de IAM que se creó con el clúster (debería ser algo así como
`eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>`). No es necesario usar ninguna plantilla de inicio
para este grupo de nodos. Haga clic en Siguiente.

En la segunda página, puede cambiar el tipo de capacidad a `Spot` si lo desea para ahorrar dinero; el constructor
Es probable que el servicio no se ejecute con mucha frecuencia o durante demasiado tiempo, por lo que es probable que la instancia de Spot lo interrumpa
las interrupciones son bajas, y siempre se puede reconstruir si eso sucede. Establezca el tamaño del disco en 50 GB; se necesita una buena cantidad de
espacio en disco para instalar y construir la base de código de Ethereal Engine, y los 20 GB predeterminados casi seguramente no serán suficientes.

Para los tipos de instancia, solo debe seleccionar los tipos que tengan más de 8 GB; t3a.xlarge son los más baratos que caben
este criterio. Si tuviera que elegir algo con 8 GB, es muy probable que la mayoría de las compilaciones bloqueen el nodo,
ya que Kubernetes tiende a reiniciar los nodos si se acercan a la capacidad de memoria.
En Configuración de escalado de grupos de nodos, establezca los tres `nodes` valores a 1. Solo queremos una sola copia del constructor
en un momento dado, y ejecutar múltiples cajas potentes puede ser costoso. Haga clic en Siguiente.

Puede dejar las subredes en la página siguiente solas y hacer clic en Siguiente. En la última página, haga clic en Crear.

## Cree repositorios ECR para imágenes creadas.

El proceso de implementación de Ethereal Engine creará múltiples imágenes de Docker, y esas deben almacenarse en algún lugar.
En AWS, ese lugar es [Registro de contenedores elásticos](https://us-west-1.console.aws.amazon.com/ecr/get-started).
Debe crear esos repositorios en la misma región de AWS donde se ejecuta el clúster de EKS.

Vaya al enlace ECR de arriba y haga clic en Comenzar en Crear un repositorio. Si estás muy preocupado por alguno de tus
Ethereal Engine project codebase(s) getting out, puede elegir Privado para la configuración de visibilidad, pero normalmente Public está bien.
Necesitará crear varios repositorios para cada implementación, por ejemplo, varios repositorios para un `dev` despliegue
varios foros más `prod` despliegue, etc.

Asumiendo que primero estás haciendo un `dev` implementación, nombre del primer repositorio `xrengine-<deployment_name>-builder` en Repositorio
Nombre, por ejemplo, `xrengine-dev-builder`. Sin embargo, no debería necesitar cambiar ninguna otra configuración, aunque si está utilizando un Privado
repo y quiero activar tag immutability, eso está bien. Las etiquetas de imagen que se generan nunca deben colisionar, pero
evitará cualquier sobrescritura manual de una etiqueta. Haga clic en Crear repositorio.

Deberá realizar cuatro repositorios más para cada uno de los servicios que se implementan como parte de la pila ethereal Engine:
`api`, `analytics`, `client`y `instanceserver`, que también están en la forma `xrengine-<deployment_name>-<service_name>`.
p. ej.. `xrengine-dev-api`, `xrengine-dev-analytics`, `xrengine-dev-client`y `xrengine-dev-instanceserver`.
Todo lo demás también se puede dejar solo para esos.

En el [página repositorios](https://us-west-1.console.aws.amazon.com/ecr/repositories), debería ver ambos
los repositorios que ha creado. Si no ve ninguno, es posible que esté en la pestaña incorrecta en la parte superior: haga clic en Privado o Público para cambiar
entre ellos. Compruebe también que se encuentra en la región de AWS correcta. Verá una columna 'URI'. Si hizo repositorios públicos,
Los URI deben tener la forma `public.ecr.aws/<identifier>/xrengine-<deployment_name>(-builder)`; si lo hiciste privado
repos, los URI deben tener la forma `<AWS_account_id>.dkr.ecr.<AWS_region>.amazonaws.com/xrengine-<deployment>(-builder)`.
Toma nota de todo antes de la `/xrengine-<deployment_name>` - deberá agregarlo como variable en pasos posteriores.
Se llamará `ECR_URL` allí.

## Crear roles de IAM para S3/SES/SNS/Route53 (o un único rol de administrador)

Ethereal Engine interactúa con varios servicios de AWS y requiere credenciales para estos fines. Podrías hacer
un rol de administrador con acceso completo a todos los servicios de AWS, pero se recomienda crear roles separados y con ámbito para
cada servicio individual. Para crear un rol, haga lo siguiente:

### Creación de un rol de IAM

Vaya a IAM->Users y haga clic en el botón Agregar usuario. En Nombre de usuario, escriba `<service>-admin`p. ej.. `S3-admin`.
Marque la casilla acceso mediante programación, haga clic en el botón Siguiente:Permisos.
Haga clic en 'Adjuntar políticas existentes directamente'. En el cuadro de texto Directivas de filtro, querrá
escriba el nombre del servicio para reducir significativamente la lista de directivas. Luego, busque el FullAccess
para ese servicio y selecciónelo, y haga clic en el botón Siguiente:Etiquetas. No es necesario etiquetarlo con
cualquier cosa, simplemente haga clic en el botón Siguiente:Revisar, luego en el botón Crear usuario.

La siguiente pantalla debería mostrar Éxito y tener el usuario en la lista. Copie el 'ID de clave de acceso' en algún lugar, y
también haga clic en el interruptor Mostrar en 'Clave de acceso secreta' y cópielo en otro lugar también. Pondrás estos
en el archivo de configuración de Helm más tarde.

### Roles de IAM para crear

Estos son los servicios para los que desea crear usuarios administradores de IAM y los permisos asociados que desea
concederles:

*   Ruta53: `AmazonRoute53FullAccess`
*   S3: `AmazonS3FullAccess, CloudFrontFullAccess`
*   SNS: `AmazonSNSFullAccess`

También deberá crear un usuario de IAM que GitHub Actions pueda usar para acceder al clúster y push/pull
Imágenes de Docker de ECR. Por convención, llamamos a este usuario 'Github-Actions-User', y necesita estos
Permisos: `AmazonEKSClusterPolicy, AmazonEKSWorkerNodePolicy, AmazonEKSServicePolicy, AmazonElasticContainerRegistryPublicAccess, AmazonEC2ContainerRegistryFullAccess`

### Creación de nuevas credenciales para un usuario de IAM

Si alguna vez pierde el secreto de un usuario, o desea crear nuevas credenciales por cualquier motivo, vaya a
IAM->Usuarios y haga clic en ese usuario. Haga clic en la pestaña 'Credenciales de seguridad' y, en 'Claves de acceso', haga clic en
debería ver un botón 'Crear clave de acceso' y, debajo de eso, 0-2 claves existentes con alguna información
sobre ellos y una 'x' en el extremo derecho para borrarlo. Si hay dos claves para ese usuario,
debe desactivar y eliminar uno de ellos antes de hacer uno nuevo.

Haga clic en el botón Crear y, a continuación, asegúrese de guardar las claves públicas y secretas en algún lugar y colocarlas en
el archivo de configuración de Helm.

## Cuadro Crear RDS

Ethereal Engine está respaldado por un servidor SQL. Utilizamos MariaDB en el desarrollo, pero también se ha ejecutado en AWS con
Aurora sin problema. La mayoría de las otras versiones de SQL deberían funcionar, pero no se han probado explícitamente.

### Acceso a la caja RDS desde una máquina externa

De forma predeterminada, solo se puede acceder a un cuadro RDS desde la VPC en la que se encuentra.
Si desea poder conectarse a ella desde fuera de esa VPC, deberá configurar una caja bastión
y SSH en esa caja, o hacer que la caja RDS sea de acceso público.

La configuración de una caja de bastión no está cubierta aquí en este momento. Se tomarán nota de los pasos para hacerlo público
a continuación por **Hacer público RDS**

### Crear instancia de RDS

Vaya a RDS y haga clic en el botón Crear base de datos. La mayoría de las opciones se pueden dejar en sus valores predeterminados.
En Configuración, proporcione un identificador de clúster de base de datos más descriptivo. El nombre de usuario maestro se puede dejar como administrador;
escriba una contraseña maestra y, a continuación, vuelva a introducirla en Confirmar contraseña.

En Clase de instancia de base de datos, elija la opción que mejor se adapte a sus necesidades de precios.

En Disponibilidad y durabilidad, se recomienda que lo dejes en el valor predeterminado de
haciendo una réplica de Aurora en otra zona de disponibilidad.

En Conectividad, asegúrese de que está en la VPC que se creó como parte del clúster de EKS.

**Hacer público RDS**
Si desea poder acceder a él externamente, debe establecer Acceso público en 'Sí'.

En Grupo de seguridad de VPC, seleccione los titulados
`eksctl-<EKS_cluster_name>-cluster-ClusterSharedNodeSecurityGroup-<random_string>` y
`eks-clustersg-<EKS_cluster_name>-<random_string>`.

Abra el menú desplegable Configuración adicional de nivel superior (no el de Conectividad). En Opciones de base de datos: > Nombre inicial de la base de datos,
asigne un nombre a la base de datos predeterminada y guárdela para usarla más adelante en el archivo de configuración de Helm.

Finalmente, haga clic en el botón Crear base de datos en la parte inferior de la página.

**Hacer público RDS** Deberá agregar un grupo de seguridad a la instancia de RDS que permita el tráfico a través del puerto
3306 (o cualquier puerto que elija para ejecutarlo). Puede hacer que este SG solo deje entrar el tráfico de su(s) dirección(es) IP
si quieres estar muy seguro al respecto, o desde cualquier lugar (0.0.0.0/0) si estás menos preocupado por alguien
obtener acceso.

## Editar grupo de seguridad para permitir el tráfico del servidor de instancias en la VPC

Deberá editar el grupo de seguridad principal del nuevo clúster para permitir el tráfico del servidor de instancias.
En el cliente web de AWS, vaya a EC2 -> Security Groups. Debería haber tres SG que tengan
el nombre del nodo en algún lugar de su nombre; busque el que está en el formulario
`eks-cluster-sg-<cluster_name>-<random_numbers>`. NO debe terminar con /ControlPlaneSecurityGroup
o /ClusterSharedNodeSecurityGroup.
Haga clic en eso, luego en la pestaña Reglas de entrada, luego haga clic en Editar reglas de entrada.

Deberá agregar dos conjuntos de reglas:

*   Tipo: UDP personalizado; Rango de puertos: 7000-8000; Fuente: En cualquier lugar (o 'Custom 0.0.0.0/0')
*   Tipo: TCP personalizado; Rango de puertos: 7000-8000; Fuente: En cualquier lugar (o 'Custom 0.0.0.0/0')

## Crear una zona hospedada de Route 53 y configurar certificados de ACM

Antes de instalar Nginx en el clúster, deberá tener toda la red al cuadrado.
Esto requiere crear los certificados SSL necesarios y crear algunos registros DNS para apuntar
varios subdominios en el lugar correcto.

### Comprar y registrar dominio a través de Route53 (opcional)

Si aún no tiene un dominio para su aplicación, es más fácil registrarlo a través de Route53.
Vaya a Route53->Domains->Registered domains, luego haga clic en el botón 'Registrar dominio' y siga el botón
flujo de trabajo para registrar un nombre de dominio.

### Crear zona hospedada de Route 53

En el cliente web de AWS, vaya a Route 53. Crear una zona hospedada para el dominio para el que planea usar
su configuración de Ethereal Engine. Volverá aquí más tarde para crear registros DNS.

#### Apunte a los subdominios de registrador externo para que usen servidores de nombres de Route53 (solo si su dominio está registrado fuera de Route53)

Si ya tiene un dominio registrado con otro servicio de registro, deberá agregar algunos registros DNS
allí para apuntar los subdominios específicos que utilizará a los servidores de nombres de AWS.

Primero, vaya a Route53->Hosted Zones y abra el dominio que usará haciendo clic en el nombre de dominio (o
resaltando la fila y haciendo clic en el botón 'Ver detalles'). Debe haber dos registros en Registros.
Busque el de tipo 'NS'; En 'Valor/Ruta de tráfico a', debe haber cuatro líneas que comiencen todas
con 'ns-'. Estos se utilizarán en breve.

Vaya a su registrador externo y vaya a la página de registros DNS. Para cada subdominio que estará en uso,
necesita agregar cuatro registros de tipo 'NS'. El Nombre será el subdominio, y el Servidor de Nombres será uno de
las cuatro líneas bajo el «NS». Necesita un registro para cada una de las cuatro líneas.

Si está configurando varias implementaciones, por ejemplo, una implementación de desarrollo y prod, necesitará un conjunto de cuatro
Registros NS para cada subdominio que esas implementaciones estarán detrás.

### Crear certificados con ACM

Vaya a Amazon Certificate Manager. Si no hay certificados en esa región, haga clic en Introducción en Aprovisionar certificados,
de lo contrario, haga clic en Solicitar un certificado.

Debe seleccionar Solicitar un certificado público y, a continuación, seleccionar Solicitar un certificado. La página siguiente
debe estar encabezado Agregar nombres de dominio. Debe agregar tanto el dominio de nivel superior, como `ethereal-engine.io`,
así como un comodín para todos los subdominios, por ejemplo. `*.ethereal-engine.io`y, a continuación, haga clic en Siguiente.

Elija Validación de DNS en la página siguiente y haga clic en Siguiente. Puede omitir la adición de etiquetas y simplemente hacer clic en Revisar,
y, a continuación, Confirmar en la página final.

Se le debe enviar a una página titulada Validación. Haga clic en la flecha al lado de cada dominio para abrir más
Opciones. Haga clic en el botón Crear registro en Route 53 para abrir un modal de confirmación, y en ese modal
haga clic en Crear.

Como indica, estos dominios pueden tardar hasta 30 minutos en validarse. Si hace clic en Completar
después de activar la creación de registros para cada uno de ellos, debe volver a la página Certificados.
Al abrir el certificado que acaba de realizar, se mostrará el estado de validación de cada dominio.

Si abre los detalles de este certificado, debe haber un campo 'ARN' con un valor que se vea
algo así como `arn:aws:acm:<region>:<AWS account ID>:certificate/<a UUID>`. Toma nota de esto para más adelante,
cuando vaya a instalar ingress-nginx.

Debe seguir las instrucciones anteriores para hacer un segundo certificado para `resources.<domain>`.
Tenga en cuenta que este certificado DEBE hacerse en us-east-1, independientemente de la región en la que se encuentre todo lo demás.
instalar en; al momento de escribir este artículo, CloudFront solo puede usar certificados en us-east-1.

## Instalar Agones, ingress-nginx y una copia de redis para cada implementación

Ahora que el clúster está en funcionamiento, podemos instalar todo en él.
Cuando creó el clúster con eksctl, debería haber creado un contexto que apuntara a
it en kubectl. Correr `kubectl config get-contexts` para obtener todos los contextos que conoce;
el que tiene una estrella al lado debe ser nombrado `<your_AWS_username>@<cluster_name>`.
Si eso no está presente, tendrá que editar la configuración para crear el contexto adecuado.

A continuación, debe agregar los gráficos Agones, ingress-nginx y redis Helm para dirigir ejecutando
`helm repo add agones https://agones.dev/chart/stable`, `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`y `helm repo add redis https://charts.bitnami.com/bitnami`.
También debe agregar en este momento el repositorio de Ethereal Engine a través de `helm repo add xrengine https://helm.xrengine.io`.

Si alguna vez sospecha que un gráfico está desactualizado, ejecute `helm repo update` para actualizarlos todos a la última.

### Instalar Agones

Desde el nivel superior de este repositorio, ejecute `helm install -f agones-default-values.yaml agones agones/agones`.
Esto dice instalar un servicio llamado 'agones' del paquete 'agones' en el gráfico 'agones', y configurarlo con
un archivo que se encuentra en https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml.

### Instalar redis para cada implementación

Cada implementación de Ethereal Engine utiliza un clúster redis para coordinar la biblioteca 'feathers-sync'.
Cada implementación de redis debe tener el mismo nombre que la implementación que la usará; para un
Implementación de Ethereal Engine denominada 'dev', la implementación de redis correspondiente tendría que llamarse
'dev-redis'.

Correr `helm install -f redis-values.yaml <deployment_name>-redis redis/redis` para instalar, por ejemplo,
`helm install -f redis-values.yaml dev-redis redis/redis`.
Si ha denominado al grupo de nodos redis algo distinto de 'ng-redis-1', tendrá que modificar el valor en
https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/redis-values.yaml en dos lugares con el nombre del grupo de nodos de redis.
Si no creó un grupo de nodos solo para redis, debe omitir el `-f redis-values.yaml`,
ya que esa configuración hace que los pods de redis se ejecuten en un grupo de nodos específico.

#### Instalación de redis como parte de la tabla Ethereal Engine (no se recomienda para producción)

Redis se puede instalar como parte del gráfico Ethereal Engine siempre que el archivo de configuración para la instalación de Ethereal Engine tenga 'redis.enabled' establecido en true.
En ese caso, debe omitir el paso anterior de instalar redis por separado. Esto no se recomienda para la producción.
sin embargo, ya que las actualizaciones a una instalación de Ethereal Engine generalmente reiniciarán los servidores redis,
lo que lleva a todos los servidores de instancias a bloquearse debido a que se cortan sus conexiones redis.

Esto rompe el comportamiento normal de Agones de mantener los servidores de instancias asignados en ejecución hasta que cada usuario se haya ido y reemplazarlos lentamente.
antiguos Servidores de instancias listos con otros nuevos, manteniendo un grupo activo de servidores de instancias en todo momento. Te encontrarás con un período
de tiempo en el que no hay servidores de instancias activos, lo que no se recomienda, y todos los servidores de instancias en uso
bajará inmediatamente.

### Instalar ingress-nginx

**Este paso no puede finalizar hasta que el certificado de ACM asociado esté completamente validado**
Abrir el archivo [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml). Toma nota de la línea
`service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "<ACM Certificate ARN for SSL>"`
Reemplace el bit en corchetes angulares, incluidos los corchetes angulares, por el ARN del certificado
ha creado para el dominio de nivel superior y todos los subdominios comodín, por ejemplo.
`service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-west-1:103947711118:certificate/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"`

No confirme este archivo con el ARN insertado; Una vez que haya completado este paso, revierta el archivo
al estado en el que se comprometió.

Desde el nivel superior de este repositorio, ejecute `helm install -f nginx-ingress-aws-values.yml nginx ingress-nginx/ingress-nginx`
Esto dice instalar un servicio llamado 'nginx' desde el paquete 'ingress-nginx' en el gráfico 'ingress-nginx', y configurarlo con
un archivo que se encuentra en https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml.

## Configurar el servicio de correo electrónico simple

Debe configurar Simple Email Service para que se puedan enviar enlaces de inicio de sesión.

En el cliente web de AWS, vaya a SES -> Domains. Haz clic en Verificar un nuevo dominio y, a continuación, introduce el nivel superior
y marque la casilla Generar configuración de DKIM y, a continuación, haga clic en Comprobar este dominio.
En el modal que aparece, debe haber un botón para crear todos los registros en la Ruta 53;
haga clic en él. A continuación, haga clic en Cerrar.

### Crear credenciales SMTP

Debe crear credenciales SMTP para autorizar SES. Estos aparecerán como un usuario de IAM,
pero debe pasar por un proceso específico de SES para obtener credenciales válidas; simplemente creando un usuario de IAM
con SESFullAccess no funcionará.

Vaya a una página de SES y seleccione 'Configuración de SMTP', luego haga clic en el botón 'Crear mis credenciales de SMTP'.
Puede dejar el nombre de usuario de IAM predeterminado tal cual; haga clic en el botón Crear. Debe ser llevado a una pantalla
dice que un usuario se ha creado correctamente. Haga clic en 'Mostrar credenciales de seguridad SMTP de usuario'.

Verá un nombre de usuario y una contraseña. El nombre de usuario es como cualquier otro ID de usuario de IAM, pero la contraseña
necesita ser transformado para convertirlo en un Secreto válido.

Estas credenciales irán al archivo de configuración de Helm. También debe rellenar la región que ha rellenado
creó estas credenciales en, reemplazando \<SES_REGION> en api.extraEnv.SMTP_HOST.

### Mover SES fuera de Sandbox

De forma predeterminada, los dominios SES están en modo Sandbox, donde solo pueden enviar correos electrónicos a direcciones de correo electrónico verificadas.
Para solicitar que el dominio se mueva fuera del modo Sandbox, vaya a SES->Email Sending->Sending Statistics.
Haga clic en el botón 'Editar los detalles de su cuenta' para abrir el modal. Establezca 'Habilitar acceso a producción' en Sí,
Deje el tipo de correo en 'Transaccional', luego complete la URL del sitio web, agregue una descripción del caso de uso (básicamente
solo asegúreles que esto es solo para iniciar sesión en la cuenta, no para nada más), haga clic en la casilla de verificación para aceptar
a su TOD, y haga clic en el botón 'Enviar para revisión'.

Puede tomar hasta unos días para que tomen medidas. Si la solicitud es rechazada, aborde sus inquietudes.
Una vez que haya sido aprobado, el inicio de sesión por correo electrónico debería funcionar para cualquier dirección de correo electrónico.

#### Verificación de correos electrónicos de prueba

Antes de tener el uso de producción para su dominio de SES, para iniciar sesión tendrá que verificar el correo electrónico específico
direcciones con SES. Vaya a SES->Identity Management->Direcciones de correo electrónico. Haga clic en el botón 'Verificar un nuevo correo electrónico
Dirección'. Ingrese la dirección con la que desea probar y luego haga clic en 'Verificar esta dirección de correo electrónico'. Pronto deberías
recibir un correo electrónico con un enlace para verificarlo (puede ir a su carpeta de spam). Una vez que hayas seguido el enlace,
puede iniciar sesión con esa dirección.

## Configurar el servicio de notificación simple

SNS se utiliza para enviar mensajes de texto desde la plataforma Ethereal Engine.

En el cliente web de AWS, vaya a SNS -> Temas y Crear un nuevo tema.
Asígnele un nombre y seleccione 'Estándar' como tipo, luego haga clic en Crear tema.

## Configurar el bucket de S3 para recursos estáticos y distribución de Cloudfront

Varios archivos estáticos se almacenan en S3 detrás de una distribución de Cloudfront.

### Crear bucket de S3

En el cliente web de AWS, vaya a Buckets de S3 -> y haga clic en Create Bucket.
Asigne un nombre al bucket `<name>-static-resources`p. ej.. `ethereal-engine-static-resources`, y que esté en la Región us-east-1.
En Propiedad de objetos, seleccione 'ACL habilitadas' y, debajo de eso, seleccione 'Escritor de objetos'.
En Bloquear la configuración de acceso público para el bucket, desmarca la casilla bloquear *todo* Acceso Público;
necesita que el bucket sea de acceso público.
Marque la casilla que aparece confirmando que sabe que el contenido es público.
Todas las demás configuraciones se pueden dejar a sus valores predeterminados; haga clic en Crear bucket.

Abra la configuración del bucket y vaya a la pestaña Permisos. A mitad de camino se encuentra 'Lista de control de acceso'. Edita eso, y
Marque las casillas de Objects:List y Bucket ACL:Read para 'Todos (acceso público)'. Haga clic en la casilla con el botón
etiqueta de advertencia que aparece que dice "Entiendo los efectos de estos cambios en mis objetos y cubos",
y, a continuación, haga clic en Guardar cambios.
En la parte inferior de la ficha Permisos hay un cuadro Uso compartido de recursos entre orígenes (CORS).
Debe tener la siguiente configuración; de lo contrario, haga clic en Editar y cópielo en:

    [
        {
            "AllowedHeaders": [],
            "AllowedMethods": [
                "HEAD",
                "GET",
                "POST"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": []
        }
    ]

### Crear distribución de Cloudfront

En el cliente web de AWS, vaya a Distribuciones de Cloudfront -> y haga clic en Crear distribución.
En 'Web', haga clic en Comenzar.

En Configuración de origen, haga clic en el cuadro junto a Nombre de dominio de origen y seleccione el nombre del bucket de S3 que acaba de crear.

En Configuración predeterminada del comportamiento de la caché, los métodos HTTP permitidos deben establecerse en 'GET, HEAD, OPTIONS'.
La configuración de la caché y la solicitud de origen deben dejarse en 'Usar una directiva de caché y una política de solicitud de origen'.
Para Origin Request Policy, seleccione 'Managed-CORS-S3Origin'

En Configuración de distribución, puede cambiar la clase de precio a "Usar solo EE. UU., Canadá y Europa" para ahorrar algo de dinero.
En Nombres de dominio alternativos, escriba 'recursos.`<domain>`', por ejemplo: `resources.ethereal-engine.io`.
Para Certificado SSL, seleccione Certificado SSL personalizado, luego cuando haga clic en el cuadro, elija
los «recursos»`<domain>`' certificado que ha realizado anteriormente.

Todo lo demás se puede dejar en los valores predeterminados, haga clic en Crear distribución.

## Configurar registros DNS

**El equilibrador de carga Nginx debe estar completamente configurado y funcionando antes de que se pueda completar este paso**

En el cliente web de AWS, vaya a Route 53 y, a continuación, vaya a la zona alojada que creó anteriormente.
Haga clic en Crear registro. Si se inicia en Registro de creación rápida, haga clic en el vínculo
'Cambiar al asistente'; no es necesario, pero el asistente es útil.

En Directiva de enrutamiento, déjelo en Enrutamiento simple y haga clic en Siguiente. A continuación, haga clic en Definir registro simple.

El primer registro debe ser para el dominio de nivel superior, por ejemplo. `ethereal-engine.io`, así que deje el nombre del registro
campo de texto en blanco. En Valor/Enrutar tráfico a, haga clic en el menú desplegable y seleccione
Alias del equilibrador de carga de red. Seleccione la región en la que se encuentra el clúster.
Donde dice Elija el equilibrador de carga, haga clic en el menú desplegable y seleccione el NLB que se creó.
Deje el tipo de registro como 'A - Enrutar el tráfico a una dirección IPv4 y algunos recursos de AWS' y, a continuación, haga clic en
Defina registro simple.

Puede seguir haciendo clic en Definir registro simple para crear más registros en un lote. Cuando estás
Listo, haga clic en Crear registros.

Debe realizar los siguientes registros 'A' en el loadbalancer, sustituyendo su dominio por 'ethereal-engine.io':

*   ethereal-engine.io
*   \*.ethereal-engine.io
*   @.ethereal-engine.io
*   api-dev.ethereal-engine.io
*   api.ethereal-engine.io
*   dev.ethereal-engine.io
*   instanceserver.ethereal-engine.io
*   instanceserver-dev.ethereal-engine.io

También debe crear un registro 'A' que apunte 'resources.ethereal-engine.io' a la distribución de CloudFront que realizó anteriormente.

## Crea la bifurcación de GitHub del repositorio de Ethereal Engine.

La base de código de Ethereal Engine se implementa más fácilmente bifurcándola y configurando algunos secretos para que el GitHub incluido
Las acciones pueden ejecutar la implementación por usted. Puede ejecutar todos los comandos que el `<dev/prod>`-La acción de implementación se ejecuta manualmente
si así lo desea, y en ese caso, no necesita bifurcar el repositorio de GH.

Vaya a https://github.com/XRFoundation/XREngine. En la esquina superior derecha, hay un botón 'Tenedor'. Haga clic en eso,
y, a continuación, haga clic en la cuenta/organización a la que desea bifurcarla. Debe ser llevado a su tenedor en poco tiempo.

Tendrás que establecer varios secretos (variables de tiempo de ejecución) para las acciones de GitHub. De forma predeterminada, las acciones de GitHub deben ser completas
habilitado, pero puede volver a comprobarlo yendo a Configuración->Acciones. Permitir todas las acciones debe seleccionarse en Acciones
Permisos.

A continuación, haga clic en Secretos en Configuración. No debería haber ninguno por defecto. Haga clic en Nuevo secreto de repositorio cerca de la parte superior de
esta página para hacer una nueva. Tendrás que hacer varios Secretos con los siguientes Nombres y Valores:

*   AWS_ACCESS_KEY -> La clave pública del usuario de IAM Github-Actions-User
*   AWS_REGION -> La región de los repositorios ECR y el clúster EKS
*   AWS_SECRET -> La clave secreta del usuario de IAM Github-Actions-User
*   CLUSTER_NAME -> El nombre del clúster de EKS
*   DEPLOYMENTS_ENABLED -> Establecer en `true`
*   DEV_REPO_NAME -> El nombre base del repositorio ECR de desarrollo, por ejemplo, `ethereal-engine-dev` (todas las referencias al constructor y a los repositorios de servicio se agregarán `-builder`/`-<service>` a este valor)
*   DOCKER_LABEL -> Esto puede ser casi cualquier cosa, pero puedes usar `lagunalabs/xrengine`
*   ECR_URL -> La raíz ECR_URL para sus repositorios, es decir, todo antes del `/ethereal-engine-dev-builder`p. ej.. `11111111111.dkr.ecr.us-west-1.amazonaws.com` o `public.ecr.aws/a1b2c3d4`
*   PRIVATE_ECR -> Establezca esto en `true` Si sus repositorios ECR son privados, si son públicos, no necesita establecer esto en absoluto

Si va a la pestaña Acciones, es posible que vea algunas ejecuciones de flujo de trabajo con marcas de verificación verdes. Si es así, volverá a ejecutar el
`dev-deploy` flujo de trabajo en breve; Su ejecución inicial solo ejecutó una comprobación para ver si debía realizar una implementación basada en
`DEPLOYMENTS_ENABLED`, y como eso no estaba establecido para ser cierto, no hizo nada más. Ahora que eso está establecido en cierto,
volver a ejecutarlo desencadenará una implementación.

Si se le pide que habilite las acciones al ir a la pestaña y no hay ejecuciones enumeradas después de habilitar acciones, entonces tendrá que
desencadenar el flujo de trabajo insertando código nuevo en la rama de desarrollo.

## Conceder acceso a Github-Actions-User al clúster

De forma predeterminada, solo el usuario de IAM que configuró un clúster de EKS puede acceder a él.
Para permitir que otros usuarios accedan al clúster, debe aplicar un aws-auth configmap al clúster
conceder acceso a usuarios específicos de IAM. Puede encontrar una plantilla para este archivo en https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/aws-auth-template.yml.

Deberá proporcionar algunos valores para este archivo. Buscar `<rolearn>`, en AWS, vaya a EKS->Clusters->
`<your cluster>`->Compute->Seleccione un grupo de nodos.  En los detalles debe estar 'Node IAM Role ARN'; copie esto
y reemplazar `<rolearn>` en el archivo aws-auth. `<account_id>` es el ID de su cuenta de AWS; en la parte superior
la esquina derecha del cliente de AWS debe ser `<your_username>@<abcd-1234-efgh>`. La cadena de 12 caracteres
después de la @ es el ID de la cuenta. Asegúrese de eliminar el `-`es del ID de la cuenta al pegarlo.
`<IAM_username>` es el nombre de usuario del usuario de IAM al que desea dar acceso, por ejemplo. `Github-Actions-User`.

Puede agregar varios usuarios copiando el `- groups:` sección bajo `mapUsers`p. ej..

      mapUsers: |
        - groups:
          - system:masters
          userarn: arn:aws:iam::abcd1234efgh:user/Github-Actions-User
          username: Github-Actions-User
        - groups:
          - system:masters
          userarn: arn:aws:iam::acbd1234efgh:user/FSmith
          username: FSmith

Cuando se complete el archivo de configuración de aws-auth, simplemente ejecute `kubectl apply -f path/to/aws-auth.yml`.

## Implementación en EKS mediante Helm

Con toda la red configurada, finalmente puede implementar la base de código en EKS.
Hay un par de pasos para esto, que implicarán implementar cosas con la mayoría, pero no con todas las necesarias.
valores de configuración y, a continuación, dejar que el proceso de implementación rellene el resto.

### Rellene el archivo de configuración de Helm con variables

Los archivos de configuración de Template Helm para implementaciones de desarrollo y productos se pueden encontrar en [configs](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/configs/) \<dev/prod>.template.values.yaml.
Antes de rellenarlos, haga una copia en otro lugar, llame a eso '\<dev/prod>.values.yaml' y edite esa copia.
Tanto el constructor como las implementaciones principales deben usar el mismo archivo de configuración. Cuando el constructor siembra la base de datos,
Necesita una serie de valores que solo deben configurarse para los demás servicios, por lo que todos los valores
debe definirse en un archivo de configuración.

Hay muchos campos para rellenar, la mayoría marcados con `<>`. No todos son necesarios para todas las situaciones, si no lo eres
usando el inicio de sesión social, por ejemplo, no necesita credenciales para Github / Google / Facebook / etc.

### Variables de configuración notables

Aquí hay algunas variables de configuración que probablemente tendrá que cambiar según su configuración específica

#### \<api/client/analytics>.affinity.nodeAffinity

Dentro de las secciones de la configuración para la api, cliente, servidor de instancias, etc., hay una sección que se ve
algo como esto:

      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: eks.amazonaws.com/nodegroup
                    operator: In
                    values:
                      - ng-1

El valor, `ng-1` En este ejemplo, debe cambiarse para que coincida con cualquiera que sea el nombre del grupo de nodos que
ese servicio se ejecutará en, por ejemplo, si crea un grupo de nodos para los servidores de instancias llamados
`abcd-instanceservers-5`, a continuación, usaría ese valor en `values:`

Si el programa de instalación de EKS creó un grupo de nodos para usted y desea usarlo para la API, el cliente y
servidores de análisis, asegúrese de cambiar el valor de afinidad para ellos a lo que EKS denominó el
grupo de nodos inicial.

#### builder.extraEnv.PRIVATE_ECR

Si está utilizando un repositorio ECR privado, configúrelo en "true" en el archivo de configuración del constructor.

#### (todo).image.repository

Deberá reemplazar cada uno \<repository_name> con el ECR_URL completo de sus repositorios que no sean de constructor, por ejemplo. `abcd1234efgh.dkr.ecr.us-west-1.amazonaws.com/ethereal-engine-dev-api`.
Cada servicio tiene que tener el adecuado `-<service>` sufijo en él, por ejemplo, `-api`, `-client`etc.

### Ejecutar la instalación de Helm

Correr `helm install -f </path/to/*.values.yaml> <stage_name>-builder xrengine/xrengine-builder`
y la carrera `helm install -f </path/to/*.values.yaml> <stage_name> xrengine/xrengine`

Esto activará las implementaciones principales y de generador utilizando el archivo de configuración de Helm, \<dev/prod>.values.yaml.
Ninguno de los dos funcionará completamente todavía, ya que aún no hay una imagen válida en los repositorios. El GitHub
Las acciones y los procesos de creación crearán esas imágenes y actualizarán las implementaciones con las etiquetas de las imágenes que han creado.
para que puedan tirar hacia abajo y usar esas imágenes.

## Iniciar acciones de GitHub

En GitHub, si vuelves a la pestaña Acciones, deberías ver un `dev-deploy` acción. Haga clic en él, y debería ver
una página que muestre su estado, que deberían ser todas las marcas de verificación verdes o indicadores de que las cosas no se ejecutaron. En la parte superior
derecha, haga clic en `Re-run all jobs`. Esto lo iniciará de nuevo, y ahora que `DEPLOYMENTS_ENABLED` se establece en true, debería
intente compilar e implementar el generador.

(Si las acciones se deshabilitaron al principio, tendrá que combinar código adicional en la rama de desarrollo para que inicie el proceso de desarrollo e implementación)

### Descripción general del proceso de compilación

El proceso completo de compilación e implementación funciona de la siguiente manera:

1.  GitHub Actions compila lo suficiente del monorepo de Ethereal Engine para obtener cualquier proyecto de Ethereal Engine instalado.
2.  GitHub Actions envía esta imagen de Docker del constructor al repositorio `xrengine-<release>-builder` en ECR
3.  GitHub Actions actualiza la implementación del constructor para que apunte a la imagen del constructor que acaba de crear.
4.  La implementación del constructor activa la imagen de Docker del constructor en su único nodo
5.  El constructor se conecta a la base de datos de la implementación y comprueba si hay una tabla `user`. Este es un proxy
    para la base de datos que se está sembrando; si no existe, siembra la base de datos con el esquema básico de Ethereal Engine,
    semillas el proyecto predeterminado en la base de datos y el proveedor de almacenamiento, y semillas de varios tipos.
6.  El constructor descarga cualquier proyecto de Ethereal Engine que la implementación haya agregado.
7.  El constructor crea la imagen de Docker para cada servicio simultáneamente utilizando estos proyectos, construyéndolos en los archivos del cliente y copiándolos para que la API y los servidores de instancias tengan acceso a ellos.
8.  El constructor empuja estas imágenes finales de Docker a los repositorios `xrengine-<release>-<service>` en ECR
9.  El constructor actualiza la implementación principal para apuntar a las imágenes finales que acaba de crear.
10. La implementación principal activa las imágenes finales de Docker para los servicios de API, análisis, cliente y servidor de instancias.

## Instalar Elastic Search y Kibana con Helm para registros de servidor

Para instalar Elasticsearch, agrega el repositorio elástico en Helm: `helm repo add elastic https://helm.elastic.co`

Ahora, use el comando curl para descargar el archivo values.yaml que contiene información de configuración:

`curl -O https://raw.githubusercontent.com/elastic/helm-charts/master/elasticsearch/examples/minikube/values.yaml`

Usa el comando helm install y el archivo values.yaml para instalar el gráfico helm de Elasticsearch:

`helm install elasticsearch elastic/elasticsearch -f ./values.yaml`

La opción -f permite especificar el archivo yaml con la plantilla. Si desea instalar Elasticsearch en un espacio de nombres específico, agregue la opción -n seguida del nombre del espacio de nombres: `helm install elasticsearch elastic/elasticsearch -n [namespace] -f ./values.yaml`

Ahora compruebe si los miembros del clúster están activos: `kubectl get pods --namespace=default -l app=elasticsearch-master -w`

La otra opción es usar el comando helm test para examinar el estado del clúster: `helm test elasticsearch`

Para instalar Kibana en la parte superior de Elasticsearch: `helm install kibana elastic/kibana`
Compruebe si todas las cápsulas están listas: `kubectl get pods`

Después de configurar el reenvío de puertos, acceda a Elasticsearch y a la GUI de Kibana escribiendo ` http://localhost:5601  `en su navegador

Para conectar el registrador con elasticsearch, actualice config file(values.yml) para Xr env `api.extraEnv.ELASTIC_HOST` por ejemplo, `http://<username>:<password>@<host>:<port>`

### Actualización de una implementación de Helm existente

Una de las características de Helm es poder actualizar fácilmente las implementaciones con nuevos valores. El comando a
hacer esto es muy similar al comando install:

`helm upgrade --reuse-values -f </path/to/*.values.yaml> --set api.image.tag=<latest_github_commit_SHA>,client.image.tag=<latest_github_commit_SHA>,instanceserver.image.tag=<latest_github_commit_SHA> <stage_name> xrengine/xrengine`

`--reuse-values` dice que transfiera todos los valores de configuración de la implementación anterior. Esto es lo más importante
para las etiquetas, ya que normalmente se establecen en línea con el `helm install/upgrade` comando, no una configuración de Helm.
Usando `-f <config_file>` y `--set <variables>` después de aplicar cualquier cambio en la parte superior de la
valores de arrastre.

Si no va a implementar una nueva compilación de la base de código, puede omitir la totalidad de la `--set *.image.tag=<SHA>`.
