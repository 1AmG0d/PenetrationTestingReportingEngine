const electron = require('electron');
const url = require('url');
const fs = require('fs');
const path = require('path');

const {app, BrowserWindow} = electron;
const { ipcMain } = require('electron');

var mainWindow;
var confWindow;
var reportWindow;

const defConfig = {
  "Config": [
    {
      "initials": "IΛMGӨÐ",
      "reportDirectory": path.join(app.getPath('documents'), 'PTRE/Reports'),
      "templateDirectory": path.join(app.getPath('documents'), 'PTRE/Templates'),
      "pentestReportTemplate": path.join(app.getPath('documents'), 'PTRE/Templates/Pentest_Report_Template.docx')
    }
  ]
};
const defDefinitions = {
  "Vulnerabilities" : [
    {
      "Vulnerability" : "XXX",
      "Security Control": "XXX",
      "Description" : "XXX",
      "Recommended Action" : "XXX"
    }
  ],
  "Levels": [
    {
      "impact" : [
        "Low",
        "Moderate",
        "High"
      ],
      "likihood" : [
        "Low",
        "Moderate",
        "High"
      ],
      "overall" : [
        "Informational",
        "Low",
        "Moderate",
        "High",
        "Critical"
      ]
    }
  ]
};

var confData;
var definitionsData;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(url.format( {
    pathname: path.join(__dirname, '/public/html/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function(){
    app.quit();
  });
};

function createConfWindow() {
  confWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  confWindow.loadURL(url.format( {
    pathname: path.join(__dirname, '/public/html/conf.html'),
    protocol: 'file:',
    slashes: true
  }));

  confWindow.on('closed', function(){
    confWindow = null;
  });

};

function createReportWindow() {
  reportWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      nodeIntegration: true
    }
  });

  reportWindow.loadURL(url.format( {
    pathname: path.join(__dirname, '/public/html/report.html'),
    protocol: 'file:',
    slashes: true
  }));

  reportWindow.on('closed', function(){
    reportWindow = null;
  });
};

function readConfigFile() {
  fs.open(path.join(app.getPath('documents'), 'PTRE/Configurations/Configuration.json'), 'r', function(err, fd){
    if (err) throw err;
  });

  data = fs.readFileSync(path.join(app.getPath('documents'), 'PTRE/Configurations/Configuration.json'));
  return JSON.parse(data);
};

function saveConfigFile(data) {
  fs.open(path.join(app.getPath('documents'), 'PTRE/Configurations/Configuration.json'), 'w', function(err, fd){
    if (err) throw err;
  });
  try {
    fs.writeFileSync(path.join(app.getPath('documents'), 'PTRE/Configurations/Configuration.json'), JSON.stringify(data, null, 4));
  } catch (err) {
    return "failure";
  }
  return "Success";
};

function readDefinitionsFile() {
  fs.open(path.join(app.getPath('documents'), 'PTRE/Configurations/Definitions.json'), 'r', function(err, fd){
    if (err) throw err;
  });

  data = fs.readFileSync(path.join(app.getPath('documents'), 'PTRE/Configurations/Definitions.json'));
  return JSON.parse(data);
};

function initializePTRE(){
  fs.stat(path.join(app.getPath('documents'), 'PTRE'), function(notexist) {
    if (notexist) {
      fs.mkdir(path.join(app.getPath('documents'), 'PTRE'), function(err) {
        if (err) throw err;
      });
    }
  });
  fs.stat(path.join(app.getPath('documents'), 'PTRE/Configurations'), function(notexist) {
    if (notexist) {
      fs.mkdir(path.join(app.getPath('documents'), 'PTRE/Configurations'), function(err) {
        if (err) throw err;
      });
    }
  });
  fs.stat(path.join(app.getPath('documents'), 'PTRE/Templates'), function(notexist) {
    if (notexist) {
      fs.mkdir(path.join(app.getPath('documents'), 'PTRE/Templates'), function(err) {
        if (err) throw err;
      });
    }
  });
  fs.stat(path.join(app.getPath('documents'), 'PTRE/Reports'), function(notexist) {
    if (notexist) {
      fs.mkdir(path.join(app.getPath('documents'), 'PTRE/Reports'), function(err) {
        if (err) throw err;
      });
    }
  });
  fs.stat(path.join(app.getPath('documents'), 'PTRE/Configurations/Configuration.json'), function(notexist) {
    if (notexist) {
      fs.writeFile(path.join(app.getPath('documents'), 'PTRE/Configurations/Configuration.json'), JSON.stringify(defConfig, null, 4), function(err) {
        if (err) throw err;
      });
    }
  });
  fs.stat(path.join(app.getPath('documents'), 'PTRE/Configurations/Definitions.json'), function(notexist) {
    if (notexist) {
      fs.writeFile(path.join(app.getPath('documents'), 'PTRE/Configurations/Definitions.json'), JSON.stringify(defDefinitions, null, 4), function(err) {
        if (err) throw err;
      });
    }
  });
};

app.on('activate', initializePTRE);

app.on('ready', function() {
  initializePTRE();
  createMainWindow();
});

app.on('window-all-closed', function() {
    app.quit();
});

ipcMain.on('OpenNewReport', function() {
  createReportWindow();
});

ipcMain.on('OpenConfWindow', function() {
  if (confWindow) {
    confWindow.show();
  } else {
    createConfWindow();
  }
});

ipcMain.on('ReadConfigFile', function(e) {
  e.returnValue = readConfigFile();
});

ipcMain.on('SaveConfigFile', function(e, data) {
  e.returnValue = saveConfigFile(data);
});

ipcMain.on('ReadDefinitionsFile', function(e) {
  e.returnValue = readDefinitionsFile();
});
