const electron = require('electron');
const { ipcRenderer } = require('electron');

var confData;
var configuration;

const initials = document.getElementById('initials');
const reportDir = document.getElementById('reportDir');
const templateDir = document.getElementById('templateDir');
const ptrTemplate = document.getElementById('ptrTemplate');
const confSave = document.getElementById('confSave');

document.addEventListener('DOMContentLoaded', function() {
  readConfig();
});

confSave.addEventListener('click', function(e){
  configuration.initials = initials.value;
  configuration.reportDirectory = reportDir.value;
  configuration.templateDirectory = templateDir.value;
  configuration.pentestReportTemplate = ptrTemplate.value;

  writeFileStatus = ipcRenderer.sendSync('SaveConfigFile', confData);
  if (writeFileStatus == "Success") {
    M.toast({html: 'Configurations Saved!'})
  } else {
    M.toast({html: 'Configurations Failed To Save!'})
  }
});

function readConfig(){
  confData = ipcRenderer.sendSync('ReadConfigFile');
  configuration = confData.Config[0];

  initials.value = configuration.initials;
  reportDir.value = configuration.reportDirectory;
  templateDir.value = configuration.templateDirectory;
  ptrTemplate.value = configuration.pentestReportTemplate;
};
