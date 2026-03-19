pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        SERVER_IP = "13.213.162.98"
        SERVER_USER = "apcom-fe"
        APP_DIR = "/home/apcom-fe/"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/sjinnovation/keypop-admin.git',
                        credentialsId: 'Github Sid'
                    ]]
                ])
            }
        }

        stage('Deploy Code to Server') {
            steps {
                sshagent(credentials: ['apcom-fe-prod']) {
                    sh '''
                        rsync -az \
                          -e "ssh -p 22 -o StrictHostKeyChecking=no" \
                          --exclude=node_modules \
                          --exclude=.git \
                          ./ ${SERVER_USER}@${SERVER_IP}:${APP_DIR}
                    '''
                }
            }
        }

        stage('Install, Build & Restart App') {
            steps {
                sshagent(credentials: ['apcom-fe-prod']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -p 22 ${SERVER_USER}@${SERVER_IP} << 'EOF'
                        
                        set -e
                        cd /home/apcom-fe/

                        echo "🧹 Cleaning old build..."
                        rm -rf node_modules
                        rm -rf build || true

                        echo "📦 Installing dependencies..."
                        npm install

                        echo "🏗️ Building app..."
                        npm run build

                        echo "🔍 Checking PM2 process..."

                        if pm2 list | grep -q "online"; then
                            echo "🔄 App already running → restarting..."
                            npm run pm2-restart
                        else
                            echo "🚀 App not running → starting..."
                            npm run pm2-start
                        fi

                        pm2 save

                        echo "✅ Deployment completed successfully"

                        EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Apcom FE deployed successfully with PM2 restart logic"
        }
        failure {
            echo "❌ Apcom FE deployment failed..."
        }
    }
}
