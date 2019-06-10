const electron = require('electron');
const { ipcRenderer } = require('electron');
const docxTemplater = require('docxtemplater');
const jsZip = require('jszip');
const fs = require('fs');
const path = require('path');
// const ImageModule = require('docxtemplater-image-module')

var outputFileName = "";

var confData;
var configuration;

var definitionData;

var vulnerabilitiesData;
var impactData;
var likelihoodData;
var overallRiskData;

var applicationName;
var applicationURL;
var reportingDate;
var vulnImpact;
var vulnLikelihood;
var overallRisk;
var overRideLever;
var vulnType;
var vulnDesc;
var vulnSecControl;
var vulnRecommendedFix;
var injParam;
var payload;
var fileInput;
var uploadedFiles = [];
var uploadedFilesB64 = [];
var uploadedImages;
var uploadedVideos;
var steps;
var totalSteps = [];
var ifInjParam = "";
var ifInjParamDesc = "";
var ifPayload = "";
var ifUploads = "";
var tempName = "";
var templateFileInput;

const addStepEvent = document.getElementById('addStep');
const generateFindingEvent = document.getElementById('generateFinding');
const vulnImpactEvent = document.getElementById('vulnImpact');
const vulnLikelihoodEvent = document.getElementById('vulnLikelihood');
const overallRiskEvent = document.getElementById('overallRisk');
const overRideEvent = document.getElementById('overrideRisk');
const vulnTypeEvent = document.getElementById('vulnType');
const fileInputEvent = document.getElementById('fileInput');
const remStepEvent = document.getElementById('remStep');
const saveTemplateEvent = document.getElementById('saveTemplate');
const loadTemplateEvent = document.getElementById('loadTemplate');
const closeWindow = document.getElementById('closeWindow');

// const fileInputEvent = document.getElementById('fileInput');

document.addEventListener('DOMContentLoaded', function() {
  readConfig();
  readDefinitions();
  applicationName = document.getElementById('applicationName');
  applicationURL = document.getElementById('applicationURL');
  reportingDate = document.getElementById('reportingDate');
  vulnImpact = document.getElementById('vulnImpact');
  vulnLikelihood = document.getElementById('vulnLikelihood');
  overallRisk = document.getElementById('overallRisk');
  overRideLever = document.getElementById('overrideRisk');
  vulnType = document.getElementById('vulnType');
  vulnDesc = document.getElementById('vulnDesc');
  vulnSecControl = document.getElementById('vulnSecControl');
  vulnRecommendedFix = document.getElementById('vulnRecommendedFix');
  injParam = document.getElementById('injParam');
  payload = document.getElementById('payload');
  fileInput = document.getElementById('fileInput');
  uploadedImages = document.getElementById('uploadedFilesImages');
  uploadedVideos = document.getElementById('uploadedFilesVideos');
  steps = document.getElementById('steps');
  tempName = document.getElementById('tempName');
  templateFileInput = document.getElementById('templateFileInput');


  for (var i = 0; i < vulnerabilitiesData.length; ++i) {
    vulnType.options[vulnType.options.length] = new Option(vulnerabilitiesData[i]['Vulnerability'], i)
  };
  for (var i = 0; i < impactData.length; ++i) {
    vulnImpact.options[vulnImpact.options.length] = new Option(impactData[i], i)
  };
  for (var i = 0; i < likelihoodData.length; ++i) {
    vulnLikelihood.options[vulnLikelihood.options.length] = new Option(likelihoodData[i], i)
  };
  for (var i = 0; i < overallRiskData.length; ++i) {
    overallRisk.options[overallRisk.options.length] = new Option(overallRiskData[i], i)
  };

  M.FormSelect.init(document.querySelectorAll('select'), {});
  M.Modal.init(document.querySelectorAll('.modal'), {});
  M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
  M.Datepicker.init(document.querySelectorAll('.datepicker'), {
    disableWeekends: true,
    setDefaultDate: true,
    defaultDate: new Date()
  });
});

function readConfig(){
  confData = ipcRenderer.sendSync('ReadConfigFile');
  configuration = confData.Config[0];
};

function readDefinitions(){
  definitionData = ipcRenderer.sendSync('ReadDefinitionsFile');

  vulnerabilitiesData = definitionData['Vulnerabilities'];
  impactData = definitionData['Levels'][0].impact;
  likelihoodData = definitionData['Levels'][0].likelihood;
  overallRiskData = definitionData['Levels'][0].overallRisk;

};

vulnTypeEvent.addEventListener('change', function(){
  vulnDesc.value = null;
  vulnSecControl.value = null;
  vulnRecommendedFix.value = null;

  if (vulnType.value == 'custom') {
    vulnDesc.disabled = false;
    vulnSecControl.disabled = false;
    vulnRecommendedFix.disabled = false;
  } else {
    var description = vulnerabilitiesData[vulnType.value]['Description'];
    var control = vulnerabilitiesData[vulnType.value]['Security Control'];
    var fix = vulnerabilitiesData[vulnType.value]['Recommended Action'];

    vulnDesc.disabled = true;
    vulnSecControl.disabled = true;
    vulnRecommendedFix.disabled = true;

    vulnDesc.value = description;
    vulnSecControl.value = control;
    vulnRecommendedFix.value = fix;
  }
  M.textareaAutoResize(vulnDesc);
  M.textareaAutoResize(vulnSecControl);
  M.textareaAutoResize(vulnRecommendedFix);
});

overRideEvent.addEventListener('change', function(){
  if (overRideLever.checked) {
    overallRisk.disabled = false;
  } else {
    overallRisk.disabled = true;
  }
  M.FormSelect.init(overallRisk, {});
});

vulnImpactEvent.addEventListener('change', function(){
  determineOverallRisk();
});
vulnLikelihoodEvent.addEventListener('change', function(){
  determineOverallRisk();
});
function determineOverallRisk(){
  var vulnImpactVal = Number(vulnImpact.value) + 1;
  var vulnLikelihoodVal = Number(vulnLikelihood.value) + 1;
  var total = vulnImpactVal * vulnLikelihoodVal;

  if (overRideLever.checked == false) {
    switch(total) {
      case 1:
        var level = 1;
        break;
      case 2:
        var level = 2;
        break;
      case 3:
        var level = 3;
        break;
      case 4:
        var level = 3;
        break;
      case 6:
        var level = 4;
        break;
      case 9:
        var level = 5;
        break;
    }
    overallRisk.selectedIndex = level;
    M.FormSelect.init(overallRisk, {});
  }
};

addStepEvent.addEventListener('click', function(){
  var stepContainer = document.createElement('div');
  stepContainer.setAttribute('class', 'collection-item row')

  var stepInput = document.createElement('textarea');
  stepInput.type = 'text';
  stepInput.setAttribute('class', 'materialize-textarea col s10 validate');
  stepInput.setAttribute('placeholder', '');

  var stepRemove = document.createElement('button');
  stepRemove.setAttribute('class', 'btn waves-effect waves-red col');
  stepRemove.setAttribute('onclick', 'removeStep(this)');
  stepRemove.innerHTML = 'Remove';

  stepContainer.appendChild(stepInput);
  stepContainer.appendChild(stepRemove);
  steps.appendChild(stepContainer);
});

function removeStep(e){
  var rootDiv = e.parentElement.parentElement;
  var eleParent = e.parentElement;
  rootDiv.removeChild(eleParent);
};

fileInputEvent.addEventListener('change', function(){
  if (fileInput.files[0] == undefined) {
    return;
  }
  uploadedFiles.push(fileInput.files[0]);

  var cardCol = document.createElement('div');
  cardCol.setAttribute('class', 'col s12 m6');

  var cardEle = document.createElement('div');
  cardEle.setAttribute('class', 'card small hoverable');

  var cardImage = document.createElement('div');
  cardImage.setAttribute('class', 'card-image');

  var cardRem = document.createElement('a');
  cardRem.setAttribute('class', 'btn waves-effect waves-red right');
  cardRem.setAttribute('onclick', 'removeFile(this)');
  cardRem.innerHTML = 'Remove';

  if (fileInput.files[0].type.split('/')[0] == 'image') {
    var cardVidImg = document.createElement('img');
    cardVidImg.setAttribute('src', fileInput.files[0].path);
    cardVidImg.setAttribute('class', 'materialboxed');
  } else if (fileInput.files[0].type.split('/')[0] == 'video') {
    var cardVidImg = document.createElement('video');
    cardVidImg.setAttribute('class', 'materialboxed responsive-video');
    cardVidImg.setAttribute('controls', '');
    cardVidImg.setAttribute('src', fileInput.files[0].path);
  }

  var cardCon = document.createElement('div');
  cardCon.setAttribute('class', 'card-content');

  var cardConIn = document.createElement('input');
  cardConIn.setAttribute('placeholder', 'Description');
  cardConIn.setAttribute('type', 'text');
  cardConIn.setAttribute('class', 'validate');

  cardImage.appendChild(cardRem);
  cardImage.appendChild(cardVidImg);

  cardCon.appendChild(cardConIn);

  cardEle.appendChild(cardImage);
  cardEle.appendChild(cardCon);

  cardCol.appendChild(cardEle);

  if (fileInput.files[0].type.split('/')[0] == 'image') {
    uploadedImages.appendChild(cardCol);
  } else if (fileInput.files[0].type.split('/')[0] == 'video') {
    uploadedVideos.appendChild(cardCol);
  }
  M.Materialbox.init(document.querySelectorAll('.materialboxed'), {
  });
});

function removeFile(e){
  for (var i = 0; i < uploadedFiles.length; i++) {
    if (uploadedFiles[i] !== undefined) {
      if (uploadedFiles[i].path == e.nextSibling.firstChild.attributes.src.value) {
        delete uploadedFiles[i];
      }
    }
  }

  var rootDiv = e.parentElement.parentElement.parentElement.parentElement;
  var eleParent = e.parentElement.parentElement.parentElement;
  rootDiv.removeChild(eleParent);
};

generateFindingEvent.addEventListener('click', function(){

  var templateContent = fs.readFileSync(path.resolve(configuration.pentestReportTemplate), 'binary');
  var zip = new jsZip(templateContent);
  var doc = new docxTemplater();
  doc.setOptions({linebreaks: true});
  doc.loadZip(zip);

  while(totalSteps.length > 0) {
      totalSteps.pop();
  }

  for (var i = 0; i < steps.children.length; i++) {
    totalSteps.push(steps.children[i].firstChild.value);
  }

  for (var i = 0; i < uploadedFiles.length; i++) {
    if (uploadedFiles[i] !== undefined) {
      getBase64(uploadedFiles[i]);
    }
  }

  outputFileName = applicationName.value + "_" + vulnType[vulnType.selectedIndex].innerText;

  if (injParam.value !== "") {
    ifInjParam = ' Via The "' + injParam.value +'" Parameter';
    ifInjParamDesc = ' via the "' + injParam.value +'" parameter';
    outputFileName += "_Via_" + injParam.value + '_Parameter';
  }
  if (payload.value !== "") {
    ifPayload = ' using the following Payload: \n' + payload.value;
  }
  if (uploadedFiles.length !== 0) {
    ifUploads = "See embedded files for walkthrough:";
  }
  if (configuration.initials !== "") {
    outputFileName += '_' + configuration.initials;
  }

  outputFileName = outputFileName.replace(" ", "_");

  doc.setData({
    applicationName: applicationName.value,
    applicationURL: applicationURL.value,
    reportingDate: reportingDate.value,
    vulnImpact: vulnImpact[vulnImpact.selectedIndex].innerText,
    vulnLikelihood: vulnLikelihood[vulnLikelihood.selectedIndex].innerText,
    overallRisk: overallRisk[overallRisk.selectedIndex].innerText,
    vulnType: vulnType[vulnType.selectedIndex].innerText,
    vulnDesc: vulnDesc.value,
    ifInjParamDesc: ifInjParamDesc.value,
    vulnSecControl: vulnSecControl.value,
    vulnRecommendedFix: vulnRecommendedFix.value,
    injParam: injParam.value,
    payload: payload.value,
    steps: totalSteps,
    // image: uploadedFiles[0].path,
    ifInjParam: ifInjParam,
    ifInjParamDesc: ifInjParamDesc,
    ifPayload: ifPayload,
    ifUploads: ifUploads,
  });

  try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
  } catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
  }

  var buf = doc.getZip().generate({type: 'nodebuffer'});

  if (configuration.reportDirectory !== "") {
    try {
      fs.writeFileSync(path.join(configuration.reportDirectory, outputFileName + '.docx'), buf);
    } catch (err) {
      M.toast({html: 'Report Generation Failed!'})
    }
    M.toast({html: 'Report Generated!'})
  } else {
    try {
      fs.writeFileSync(path.join(app.getPath('documents'), 'PTRE/Reports/' + outputFileName + '.docx') , buf);
    } catch (err) {
      M.toast({html: 'Report Generation Failed!'})
    }
    M.toast({html: 'Report Generated!'})
  }
});

saveTemplateEvent.addEventListener('click', function(){
  var templateData = {
    applicationName: applicationName.value,
    applicationURL: applicationURL.value,
    reportingDate: reportingDate.value,
    vulnImpact: vulnImpact.value,
    vulnLikelihood: vulnLikelihood.value,
    overallRisk: overallRisk.value,
    vulnType: vulnType.value,
    vulnDesc: vulnDesc.value,
    vulnSecControl: vulnSecControl.value,
    vulnRecommendedFix: vulnRecommendedFix.value,
    injParam: injParam.value,
    payload: payload.value,
  };

  if (configuration.templateDirectory !== "") {
    try {
      fs.writeFileSync(path.join(configuration.templateDirectory, tempName.value + '.json'), JSON.stringify(templateData, null, 4));
    } catch (err) {
      M.toast({html: 'Template Failed To Save!'})
    }
    M.toast({html: 'Template Saved!'})
  } else {
    try {
      fs.writeFileSync(path.join(app.getPath('documents'), 'PTRE/Templates/' + tempName.value + '.json') , JSON.stringify(templateData, null, 4));
    } catch (err) {
      M.toast({html: 'Template Failed To Save!'})
    }
    M.toast({html: 'Template Saved!'})
  }
});

loadTemplateEvent.addEventListener('click', function(){
  fs.open(path.join(templateFileInput.files[0].path), 'r', function(err, fd){
    if (err) throw err;
  });

  var templateData = JSON.parse(fs.readFileSync(templateFileInput.files[0].path));

  applicationName.value = templateData.applicationName;
  applicationURL.value = templateData.applicationURL;
  reportingDate.value = templateData.reportingDate;
  vulnImpact.value = templateData.vulnImpact;
  vulnLikelihood.value = templateData.vulnLikelihood;
  overallRisk.value = templateData.overallRisk;
  vulnType.value = templateData.vulnType;
  vulnDesc.value = templateData.vulnDesc;
  vulnSecControl.value = templateData.vulnSecControl;
  vulnRecommendedFix.value = templateData.vulnRecommendedFix;
  injParam.value = templateData.injParam;
  payload.value = templateData.payload;

  M.FormSelect.init(document.querySelectorAll('select'), {});
  M.textareaAutoResize(vulnDesc);
  M.textareaAutoResize(vulnSecControl);
  M.textareaAutoResize(vulnRecommendedFix);

  M.toast({html: 'Template Loaded!'})
});

function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     uploadedFilesB64.push(reader.result);
   };
};

closeWindow.addEventListener('click', function(e){
  ipcRenderer.send('closeWindow');
});
