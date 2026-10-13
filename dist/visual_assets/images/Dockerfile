FROM nginx:alpine

COPY ./index.html /usr/share/nginx/html/index.html
COPY ./styles.css /usr/share/nginx/html/styles.css
COPY ./script.js /usr/share/nginx/html/script.js
COPY ./Logo.png /usr/share/nginx/html/Logo.png

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
