pipeline {
    agent any
    environment {
      ENV_FILE_ID = '342cbbf9-e0a8-4807-b11c-1d9ec45b0860'
      IMAGE_VERSION = '0.1'
    }
    stages {
      stage('Provision ENV File') {
          steps {
          sh 'echo "Provisioning .env.production.local file..."'
          configFileProvider([configFile(fileId: "${ENV_FILE_ID}", targetLocation: '.env.production.local')]) {
            sh 'echo .env.production.local file provisioned'
          }
          }
      }
      stage('Build docker images') {
        steps {
          sh 'echo "Building docker image..."'
          sh "docker build -t neenus007/xlsx2csv-client:${IMAGE_VERSION}.${BUILD_NUMBER} -f Dockerfile ."
          sh 'docker build -t neenus007/xlsx2csv-client:latest -f Dockerfile .'
        }
      }
      stage('Login to DockerHub') {
        steps {
          sh 'echo "Logging in to DockerHub..."'
          sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        }
      }
      stage('Push images to DockerHub') {
        steps {
          sh 'echo "Pushing to DockerHub..."'
          sh "docker push neenus007/xlsx2csv-client:${IMAGE_VERSION}.${BUILD_NUMBER}"
          sh 'docker push neenus007/xlsx2csv-client:latest'
        }
      }
      stage('Logout from DockerHub') {
        steps {
          sh 'echo "Logging out from DockerHub..."'
          sh 'docker logout'
        }
      }
    }
}

