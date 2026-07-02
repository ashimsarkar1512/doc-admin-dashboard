pipeline {
    agent {
        docker {
            image "node:22-bookworm"
            args "-u root"
            reuseNode true
        }
    }

    environment {
        DOCKER_IMAGE = "softvence/doc-dashboard"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "doc-dashboard"
        SSH_HOST = "187.77.23.79"
        SSH_CREDENTIALS_ID = "doc-ssh-creds"
        SERVER_PATH = "/var/projects/doc-dashboard"
        CADDY_CONTAINER = "doc-backend-caddy"
    }

    stages {
        stage("Prepare Agent") {
            steps {
                sh "apt-get update && apt-get install -y --no-install-recommends openssh-client && rm -rf /var/lib/apt/lists/*"
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "npm ci"
            }
        }

        stage("Build") {
            steps {
                sh "npm run build"
            }
        }

        stage("Deploy") {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS_ID}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${SSH_HOST} "mkdir -p ${SERVER_PATH} && find ${SERVER_PATH} -mindepth 1 -delete"
                        tar -C dist -czf - . | ssh -o StrictHostKeyChecking=no root@${SSH_HOST} "tar -xzf - -C ${SERVER_PATH}"
                    """
                }
            }
        }

        stage("Restart Caddy") {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS_ID}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${SSH_HOST} "docker restart ${CADDY_CONTAINER}"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Frontend deployed to ${SERVER_PATH} and ${CADDY_CONTAINER} restarted."
        }
    }
}

