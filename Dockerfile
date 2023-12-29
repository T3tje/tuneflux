FROM --platform=linux/amd64 openjdk:21
LABEL maintainer="tilman2013@gmail.com"
EXPOSE 8080
ADD backend/target/tuneflux.jar tuneflux.jar
CMD [ "sh", "-c", "java -jar /tuneflux.jar" ]