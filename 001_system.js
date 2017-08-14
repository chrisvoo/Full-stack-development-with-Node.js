   const os = require('os');
   const prettyBytes = require('pretty-bytes');		// for bytes human displaying

   var nodeVersion = process['title'] + " " + process['version'],
       platform = process['platform'] + " " + process['arch'], // os.platform() / os.arch()
       userHome = process.env.HOME, user = process.env.LOGNAME,
       workingDir = process.env.PWD, host = os.hostname(),
       shell = os.userInfo().shell, totalCPUs = os.cpus().length;

   console.log("Running " + nodeVersion + " on " + platform);
   console.log("Home: " + userHome + "\tuser: " + user + "@" + host + "\tshell: " + shell);
   console.log("Available memory: " + prettyBytes(os.freemem()) + "/" + prettyBytes(os.totalmem()));
   console.log("CPUs: " + totalCPUs);	

   for(var cpu of os.cpus())
     console.log("\t- " + cpu.model);	

   // the load average should ideally be less than the number of logical CPUs in the system
   var loadAvg = os.loadavg();
   console.log("Load average: ");
   console.log("\t- last minute: " + loadAvg[0]);  
   console.log("\t- last 5 minutes: " + loadAvg[1]);
   console.log("\t- last 15 minutes: " + loadAvg[2]);   
