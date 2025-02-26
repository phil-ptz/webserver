# /etc/nginx/sites-available/fitguide.com
# Diese Konfigurationsdatei ist spezifisch für die Seite
# fitguide.com und wir von nginx.conf mit eingebunden.

server {
    # Auf Port 80 nach Requests hören (80 ist der Port für den Cloudflare-Tunnel)
    listen 0.0.0.0:80;

    # Servername für Nginx
    server_name fitguide.com;

    # An dieser Stelle wird der gesamte Traffic von Nginx an den Node.js-Server weitergeleitet.
    location / {
      # Header für den weitergeleiteten Traffic
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;

      # Traffic an localhost:3000 weiterleiten (Port 3000 ist der listen-Port des Node.js-Servers)
      proxy_pass http://127.0.0.1:3000/;
      proxy_redirect off;
    }
 }
