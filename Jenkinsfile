node ('master') {

        try {
                 stage('Cleanup'){

                }
                stage('SCM') {
                       checkout scmGit(
                                branches: [[name: '*/jenkins-build']],
                                extensions: [],
                                userRemoteConfigs: [[credentialsId: 'github-creds',
                                 url: 'https://github.com/Harini2196/admin-page.git']])
                }

                stage('Build the code and Docker image') {
                        sh """  ls -l ${WORKSPACE}
                                docker build -t ${DockerTag} .
                        """
                }
        }catch(err) {
                wrap([$class: 'AnsiColorBuildWrapper']) {
                        println "\u001B[41m[ERROR]: Build Failed"
                }
                currentBuild.result = "FAILED"
                throw err
        }
}
