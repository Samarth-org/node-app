@Library('jenkins-shared-library') _

pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        IMAGE_NAME = "samarthdoc123/node-app"
        IMAGE_TAG  = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')    // pipeline times out in 30 mins
        disableConcurrentBuilds()              // no parallel builds
        buildDiscarder(logRotator(numToKeepStr: '5'))  // keep last 5 builds
    }

    stages {

        stage('Install Dependencies') {
            steps {
                installDeps()
            }
        }

        stage('Run Tests') {
            steps {
                runTests()
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results.xml'
                }
            }
        }

        stage('Code Coverage') {
            steps {
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'coverage/lcov-report',
                    reportFiles: 'index.html',
                    reportName: 'Code Coverage Report'
                ])
            }
        }

        stage('Build & Push Docker') {
            when {
                anyOf {
                    branch 'main'         // only build on main
                    branch 'dev'          // or dev branch
                }
            }
            steps {
                buildAndPush("${IMAGE_NAME}", "${IMAGE_TAG}")
            }
        }

        stage('Smoke Test') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    docker run -d --name smoke-test -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}
                    sleep 5
                    curl -f http://localhost:3000/health || exit 1
                    docker stop smoke-test
                    docker rm smoke-test
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline SUCCESS - ${env.BRANCH_NAME} #${env.BUILD_NUMBER}"
        }
        failure {
            echo "Pipeline FAILED - ${env.BRANCH_NAME} #${env.BUILD_NUMBER}"
        }
        unstable {
            echo "Pipeline UNSTABLE - ${env.BRANCH_NAME} #${env.BUILD_NUMBER}"
        }
        always {
            cleanWs()   // clean workspace after every build
        }
    }
}