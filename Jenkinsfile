pipeline {
  agent {
    node {
      label 'JENKINS_TEST_NODE'
    }
  }

  stages {
    stage('Clone Sources') {
      steps {
        checkout scm
      }
    }

    stage('Build & Test') {
      steps {
        sh 'echo test build'
      }
    }
  }
}
