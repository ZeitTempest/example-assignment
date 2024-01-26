# to create the base image from node 
# need to see the version to download and substantiate it 
FROM node:16-alpine3.16 
 
# setting working directory of the docker container (so taht all commands will be executed inside the container) 
WORKDIR /app 
 
# copy from (Host file system/tar file) to (image/container file system) 
COPY ./api-1.0.0.tgz /app 
 
# runs when the image is created (with reference from workdir) 
RUN npm install ./api-1.0.0.tgz

# rename the node_module folder (so that i am able to replace it with the one from my tar file) 
# should remove the workspace!! (make sure the workspace is clean and ONLY the required files)
RUN mv node_modules nm 
 
# moves the node-module files to the outside 
RUN mv nm/api/* ./ 
RUN mv nm/bcryptjs ./node_modules 
 
# adding non-root user 
# -D specifies that user should not be given a password 
# -u sets the user ID to 10001 
# RUN adduser --disabled-password -uid 10001 user1 
RUN adduser -D -u 10001 user1 
 
# copy files into container 
COPY . . 
# container uses non-root user account 
USER user1 
 
# exposes the local port 
EXPOSE 2424 
 
# runs when the container is started based on the image 
CMD ["node", "index.js"] 
 
# docker build -t tmsimage . (this tells docker to build the image that is in the relative path to find the dockerfile)
# docker run --env-file ./config/config.env -p 2424:2424 tmsimage (this tells the container to start with the builder's image)


# # Check if package.json is the same
# RUN if cmp -s package.json /app/package.json; then \
#         echo "Package.json is the same. Proceeding with Docker build."; \
#     else \
#         echo "Package.json has changed. Skipping Docker build."; \
#         exit 1; \
#     fi

# # Build your application (add your build commands here)
# RUN npm run build