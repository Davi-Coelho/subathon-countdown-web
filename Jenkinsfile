node('ridley') {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        app = docker.build("registry.davicoelho.com/subathon-timer/timer", "--build-arg password=${DB_PASS} .")
    }

    stage('Push image') {
        docker.withRegistry('https://registry.davicoelho.com', 'jenkins-robot') {
            app.push("${env.BUILD_NUMBER}")
        }
    }

    stage('Trigger deploy') {
        echo "Triggering subathon-timer job"
        build job: 'subathontimer', wait: false, parameters: [password(name: 'DB_PASS', value: DB_PASS),
                                                 string(name: 'TAG', value: env.BUILD_NUMBER)]
    }
}