node ('master') {
        try { 
                stage('SCM') {
                       checkout scmGit(
                                branches: [[name: '*/feature']],
                                extensions: [],
                                userRemoteConfigs: [[credentialsId: 'github-creds',
                                 url: 'https://github.com/Harini2196/admin-page.git']])
                }

                stage('Build the code and Docker image') {
                        sh """
                                sudo systemctl start docker
                                sudo chmod 666 /var/run/docker.sock
                                ls -l ${WORKSPACE}
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
