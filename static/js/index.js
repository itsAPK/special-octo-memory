// Function to fetch patient data from the given URL
async function fetchPatientsData() {
  const response = await fetch(
    "https://fedskillstest.coalitiontechnologies.workers.dev",
    {
      headers: {
        Authorization: "Basic Y29hbGl0aW9uOnNraWxscy10ZXN0",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch patient data");
  }
  return await response.json();
}

// Function to create a patient element
function createPatientElement(patient) {
  const dataDiv = document.createElement("div");
  dataDiv.className = "data";

  const basicInfoDiv = document.createElement("div");
  basicInfoDiv.className = "basic-info";

  const img = document.createElement("img");
  img.src = patient.profile_picture;
  img.style = "width:48px;height:48px;";

  const infoDiv = document.createElement("div");

  const nameSpan = document.createElement("span");
  nameSpan.className = "name";
  nameSpan.textContent = patient.name;

  const br = document.createElement("br");

  const ageSpan = document.createElement("span");
  ageSpan.className = "age";
  ageSpan.textContent = `${patient.gender}, ${patient.age}`;

  infoDiv.appendChild(nameSpan);
  infoDiv.appendChild(br);
  infoDiv.appendChild(ageSpan);

  basicInfoDiv.appendChild(img);
  basicInfoDiv.appendChild(infoDiv);

  const moreImg = document.createElement("img");
  moreImg.style.maxWidth = "16px";
  moreImg.style.height = "17px";
  moreImg.style.marginTop = "4px";
  moreImg.src = "static/assets/icons/more_horiz_FILL0_wght300_GRAD0_opsz24.svg";

  dataDiv.appendChild(basicInfoDiv);
  dataDiv.appendChild(moreImg);

  return dataDiv;
}

// Function to create a table row for a diagnostic entry
function createDiagnosticRow(diagnostic) {
  const tr = document.createElement("tr");

  const nameTd = document.createElement("td");
  nameTd.textContent = diagnostic.name;

  const descriptionTd = document.createElement("td");
  descriptionTd.textContent = diagnostic.description;

  const statusTd = document.createElement("td");
  statusTd.textContent = diagnostic.status;

  tr.appendChild(nameTd);
  tr.appendChild(descriptionTd);
  tr.appendChild(statusTd);

  return tr;
}

function createLabReportItem(labResult) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item font-normal";

  const textDiv = document.createElement("div");
  textDiv.textContent = labResult;

  const downloadIcon = document.createElement("img");
  downloadIcon.src =
    "static/assets/icons/download_FILL0_wght300_GRAD0_opsz24 (1).svg";
  downloadIcon.style.width = "16px";
  downloadIcon.style.height = "16px";

  itemDiv.appendChild(textDiv);
  itemDiv.appendChild(downloadIcon);

  return itemDiv;
}

// Function to render data
async function renderPatientsData() {
  const patientsDataElement = document.getElementById("patientsData");
  try {
    //Render Patient Data
    const patients = await fetchPatientsData();
    patients.forEach((patient) => {
      const patientElement = createPatientElement(patient);
      patientsDataElement.appendChild(patientElement);
    });

    const jessicaData = patients.find(
      (entry) => entry.name === "Jessica Taylor"
    );

    const diagnosticList = jessicaData.diagnostic_list; // Assuming the API response contains a "diagnostic_list" property

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    diagnosticList.forEach((diagnostic) => {
      const diagnosticRow = createDiagnosticRow(diagnostic);
      tbody.appendChild(diagnosticRow);
    });

    document.getElementById("dob").innerHTML = jessicaData.date_of_birth;
    document.getElementById("gender").innerHTML = jessicaData.gender;
    document.getElementById("contactInfo").innerHTML = jessicaData.phone_number;
    document.getElementById("emergency").innerHTML =
      jessicaData.emergency_contact || "----";
    document.getElementById("insurance").innerHTML = jessicaData.insurance_type;

    const profilePicUrl = jessicaData.profile_picture; // Assuming the API response contains a "profile_pic" property

    const profilePicElement = document.querySelector(".profile-pic img");
    profilePicElement.src = profilePicUrl;
    //Chart Data

    if (!jessicaData) {
      throw new Error("Data for Jessica Taylor not found");
    }

    const labels = jessicaData.diagnosis_history
      .slice(0, 5)
      .reverse()
      .map((entry) => `${entry.month},${entry.year}`);
    const systolicData = jessicaData.diagnosis_history
      .slice(0, 5)
      .reverse()
      .map((entry) => entry.blood_pressure.systolic.value);
    const diastolicData = jessicaData.diagnosis_history
      .slice(0, 5)
      .reverse()
      .map((entry) => entry.blood_pressure.diastolic.value);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Systolic",
          data: systolicData,
          fill: false,
          borderColor: "#C26EB4",
          tension: 0.3,
        },
        {
          label: "Diastolic",
          data: diastolicData,
          fill: false,
          borderColor: "#7E6CAB",
          tension: 0.3,
        },
      ],
    };

    // Update chart
    myChart.data = chartData;
    myChart.update();

    //lab report

    const labResults = jessicaData.lab_results;

    const labReportElement = document.getElementById("labreport");
    labReportElement.innerHTML = "";

    labResults.forEach((labResult) => {
      const labReportItem = createLabReportItem(labResult);
      labReportElement.appendChild(labReportItem);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderPatientsData();
});

// Get the canvas element
const ctx = document.getElementById("chart").getContext("2d");

// Create initial chart
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    title: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});
