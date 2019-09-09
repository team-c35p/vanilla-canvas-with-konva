pipeline {
  agent {
    node {
      label 'master'
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
        sh 'echo hello first build'
      }
    }
  }
}
