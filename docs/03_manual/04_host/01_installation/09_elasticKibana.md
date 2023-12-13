# Setup Elastic Search & Kibana

Elastic Search and Kibana will be automatically launched with `npm run dev`.

Elasticsearch & Kibana will be running on localhost port 9200 & 5601 respectively.

This will automatically set up and run Redis/MariaDB docker
containers, and Ethereal Engine client/server/instance-server instances.

In a browser, navigate to https://127.0.0.1:3000/location/default

The database seeding process creates an empty location called 'default', as well as some template scenes 'sky-station' and 'apartment'.
It can be navigated to by going to 'https://127.0.0.1:3000/location/default'

As of this writing, the cert provided in the etherealengine package for local use is
not adequately signed. Browsers will throw up warnings about going to insecure
pages. You should be able to tell the browser to ignore it, usually by clicking
on some sort of 'advanced options' button or link and then something along the
lines of 'go there anyway'.

Chrome sometimes does not show a clickable option on the warning. If so, just
type `badidea` or `thisisunsafe` when on that page. You don't enter
that into the address bar or into a text box, Chrome is just passively listening
for those commands.

Once the location loads successfully, the media server may not load.  If this happens, bring up the browser console and look for a websocket
error.  If you find this error, copy the link of the URL and paste into a new browser tab.  Delete wss:// and replace it with https:// and press
enter.  Follow the same instructions to accept the risk in the browser as above.