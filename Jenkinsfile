@Library('jenkins-shared-library') _

pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        IMAGE_NAME = "samarthdoc123/node-app"
        IMAGE_TAG  = "${env.GIT_BRANCH ? env.GIT_BRANCH.replaceAll('origin/', '') : 'main'}-${env.BUILD_NUMBER}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5'))
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
                    branch 'main'
                    expression { env.GIT_BRANCH == 'origin/main' }
                    expression { env.BRANCH_NAME == null }
                }
            }
            steps {
                buildAndPush(IMAGE_NAME.toString(), IMAGE_TAG.toString())
            }
        }

        stage('Smoke Test') {
            when {
                anyOf {
                    branch 'main'
                    expression { env.GIT_BRANCH == 'origin/main' }
                    expression { env.BRANCH_NAME == null }
                }
            }
            steps {
                sh """
                    docker run -d --name smoke-test -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}
                    sleep 5
                    curl -f http://localhost:3000/health || exit 1
                    docker stop smoke-test
                    docker rm smoke-test
                """
            }
        }
    }

    post {
        success {
            notify('SUCCESS')
        }
        failure {
            notify('FAILED')
        }
        unstable {
            notify('UNSTABLE')
        }
        always {
            cleanWs()
        }
    }
}