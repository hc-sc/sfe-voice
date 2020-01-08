// TODO: Write CI pipeline

// pipeline {
//   agent {
//     label 'sfe-dev'
//   }

//   options {
//     disableConcurrentBuilds() 
//   }
  
//   environment {
//     containerRegistryCredentials = credentials( 'ARTIFACTORY_PUBLISH' )
//     containerRegistry = 'jack.hc-sc.gc.ca'
//     containerRegistryPull = 'jack.hc-sc.gc.ca'
//   }

//   stage("Test") {
//     steps {
//       sh```
//         npm run test
//       ```
//     }
//   }

//   stage("Deploy") {
//     when {
//       branch 'master'
//     }

//     steps {
//       // TODO: SSH into dev server and apply changes
//     }
//   }
// }
