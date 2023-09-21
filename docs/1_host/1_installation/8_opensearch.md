
#  Logging with Opensearch on Docker

If you want to quickstart with detailed logging using opensearch, Please follow this guide. 

## Setup Opensearch on Docker locally

### Pull OpenSearch Images 

#### OpenSearch

```bash
docker pull opensearchproject/opensearch:latest
```    
#### OpenSearch Dashboard

```bash     
docker pull opensearchproject/opensearch-dashboards:latest
```

### Start Opensearch Containers

#### OpenSearch

```bash
docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "plugins.security.disabled=true" opensearchproject/opensearch:latest 
```

#### OpenSearch Dashboard

```bash
docker run -it -d --network="host" -e "DISABLE_SECURITY_DASHBOARDS_PLUGIN=true" opensearchproject/opensearch-dashboards:latest
```


### Verify if the containers are up & running

- Send a request to port 9200

```bash
    curl http://127.0.0.1:9200
```
        
- List Indices through curl 

```bash         
    curl -X GET "http://127.0.0.1:9200/_cat/indices?v"
```

- Create Indices through Curl 

```bash
    curl -X PUT "http://127.0.0.1:9200/your_index_name"
```

- Delete Index 

```bash
    curl --location --request DELETE 'http://127.0.0.1:9200/index_name'
```

- Fetch logs for an index_name

```bash
    curl --location --request GET 'http://127.0.0.1:9200/ethereal/_search' \
    --header 'Content-Type: application/json' \
    --data '{
    "query": {
        "match_all": {}
    },
    "size": 10000
    }'
```
  
### Enable Client Logging

Set VITE_FORCE_CLIENT_LOG_AGGREGATE to true to enable client log aggregation

    VITE_FORCE_CLIENT_LOG_AGGREGATE=true
    
### Enable Server Logging

Set DISABLE_SERVER_LOG=false to false to enable server log aggregation  

    DISABLE_SERVER_LOG=false
        
Note: These changes in the `.env.local` file will ensure proper communication with OpenSearch and enable client and server log aggregation