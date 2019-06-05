const electron = require('electron');
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function() {
  M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
  M.Materialbox.init(document.querySelectorAll('.materialboxed'), {});
  M.Modal.init(document.querySelectorAll('.modal'), {});
});

const newReportButton = document.getElementById('newReport');
newReportButton.addEventListener('click', function(){
  ipcRenderer.send('OpenNewReport');
});

const confButton = document.getElementById('conf');
confButton.addEventListener('click', function(){
  ipcRenderer.send('OpenConfWindow');
});
