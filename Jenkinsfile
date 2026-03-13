@Library('jenkins-shared-library') _         // loads the shared library

pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                installDeps()        // calling vars/installDeps.groovy
            }
        }

        stage('Run Tests') {
            steps {
                runTests()           // calling vars/runTests.groovy
            }
        }

        stage('Build & Push Docker') {
            steps {
                buildAndPush('myorg/node-app', "${env.BUILD_NUMBER}")
                //           ↑ image name     ↑ tag
            }
        }
    }
}