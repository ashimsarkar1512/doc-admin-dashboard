pipeline {
    agent {
        docker {
            image 'node:22-bookworm'
            reuseNode true
        }
    }

    environment {
        SSH_HOST           = '187.77.23.79'
        SSH_CREDENTIALS_ID = 'doc-ssh-creds'
        SERVER_PATH        = '/var/projects/doc-dashboard'
        CADDY_CONTAINER    = 'doc-backend-caddy'
    }

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs(
                    deleteDirs: true,
                    disableDeferredWipeout: true
                )
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y --no-install-recommends openssh-client
                    rm -rf /var/lib/apt/lists/*
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Fix Permissions') {
            steps {
                sh '''
                    chmod -R u+rwX,go+rX dist || true
                '''
            }
        }

        stage('Deploy to Server') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${SSH_HOST} '
                            mkdir -p ${SERVER_PATH} &&
                            find ${SERVER_PATH} -mindepth 1 -delete
                        '

                        tar -C dist -czf - . | ssh -o StrictHostKeyChecking=no root@${SSH_HOST} "
                            tar -xzf - -C ${SERVER_PATH}
                        "
                    """
                }
            }
        }

        stage('Restart Caddy') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${SSH_HOST} "
                            docker restart ${CADDY_CONTAINER}
                        "
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs(
                deleteDirs: true,
                disableDeferredWipeout: true
            )
        }

        success {
            echo '✅ Deployment successful'
        }

        failure {
            echo '❌ Deployment failed'
        }
    }
}