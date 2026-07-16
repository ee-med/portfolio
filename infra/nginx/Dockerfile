FROM nginx:1.28-alpine

# Portainer does not retain Git-stack files reliably for runtime bind mounts.
# Bake the public configuration templates into the image instead.
COPY templates/ /etc/nginx/templates/
