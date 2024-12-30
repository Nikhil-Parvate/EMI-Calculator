const loanAmountSlider = document.getElementById("loanAmount");
const interestRateSlider = document.getElementById("interestRate");
const tenureSlider = document.getElementById("tenure");

const loanAmountDisplay = document.getElementById("loanAmountDisplay");
const interestRateDisplay = document.getElementById("interestRateDisplay");
const tenureDisplay = document.getElementById("tenureDisplay");

const emiResult = document.getElementById("emiResult");
const totalInterest = document.getElementById("totalInterest");
const totalPayment = document.getElementById("totalPayment");

const emiTable = document.getElementById("emiTable");
const resultsSection = document.getElementById("results");

// Chart variables
let pieChart;

  

function updateDisplay(e,id){
    document.getElementById(id).value = e.value;
    console.log(e.value,loanAmountDisplay);
}
function range_updateDisplay(e,id){
    document.getElementById(id).value = e.value;
    console.log(e.value,loanAmountDisplay);
}

function calculateEMI(){
  const loanAmount = parseFloat(loanAmountSlider.value);
  const annualInterestRate = parseFloat(interestRateSlider.value);
  const tenureInMonths = parseInt(tenureSlider.value) * 12;

  const monthlyRate = annualInterestRate / 12 / 100;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
              (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

  const totalPaymentValue = emi * tenureInMonths;
  const totalInterestValue = totalPaymentValue - loanAmount;

  emiResult.textContent = Number(emi.toFixed(2)).toLocaleString();
  totalInterest.textContent = Number(totalInterestValue.toFixed(2)).toLocaleString();
  totalPayment.textContent = Number(totalPaymentValue.toFixed(2)).toLocaleString();

  let balance = loanAmount;
  emiTable.innerHTML = "";
  for (let month = 1; month <= tenureInMonths; month++) {
    const interest = balance * monthlyRate;
    const principal = emi - interest;
    balance -= principal;

    const row = `
      <tr class="text-center">
        <td class="border p-2">${month}</td>
        <td class="border p-2">₹${Number(principal.toFixed(2)).toLocaleString()}</td>
        <td class="border p-2">₹${Number(interest.toFixed(2)).toLocaleString()}</td>
        <td class="border p-2">₹${Number(Math.max(balance, 0).toFixed(2)).toLocaleString()}</td>
      </tr>
    `;
    emiTable.innerHTML += row;

    if (balance <= 0) break;
  }

  // Update Pie Chart
  const chartData = [loanAmount, totalInterestValue];
  if (pieChart) {
    pieChart.destroy();
  }
  const ctx = document.getElementById("pieChart").getContext("2d");

    pieChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Principal", "Interest"],
        datasets: [
        {
            data: chartData,
            backgroundColor: ["#4caf50", "#ff9800"],
        },
        ],
    },
    options: {
        responsive: true,
        plugins: {
        legend: {
            position: "top",
        },
        tooltip: {
            callbacks: {
            label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.raw / total) * 100).toFixed(2);
                return `${context.label}: ₹${context.raw.toLocaleString()} (${percentage}%)`;
            },
            },
        },
        datalabels: {
            color: "#ffffff", // Text color
            font: {
            weight: "bold",
            size: 14,
            },
            formatter: (value, context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage
            return `${percentage}%`; // Show percentage
            },
        },
        },
    },
    plugins: [ChartDataLabels], // Register the datalabels plugin
    });


  resultsSection.classList.remove("hidden");
}


const defaultValues = {
    homeLoan: {
      loanAmount: 2500000,
      interestRate: 8.5,
      tenure: 15,
    },
    personalLoan: {
      loanAmount: 200000,
      interestRate: 12,
      tenure: 5,
    },
    carLoan: {
      loanAmount: 300000,
      interestRate: 10,
      tenure: 7,
    },
  };
  
  function showTab(tabName) {
    // Update slider values based on the selected loan type
    const selectedValues = defaultValues[tabName];
    loanAmountSlider.value = selectedValues.loanAmount;
    interestRateSlider.value = selectedValues.interestRate;
    tenureSlider.value = selectedValues.tenure;
  
    // Update displayed values
    loanAmountDisplay.value = selectedValues.loanAmount;
    interestRateDisplay.value = selectedValues.interestRate;
    tenureDisplay.value = selectedValues.tenure;

  
    // Calculate EMI with the default values
    calculateEMI();
  
    // Update tab styling (optional)
    document.querySelectorAll(".tab-link").forEach((btn) => {
      btn.classList.remove("text-blue-500", "border-blue-500", "bg-green-100");
      btn.classList.add("text-gray-500", "bg-gray-100");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add(
        "text-blue-500", "border-blue-500", "bg-green-100","border-b-2","border-blue-500");
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.remove("text-gray-500", "bg-gray-100");
    const stoppersContainer =  document.querySelector("#loan-Tenure  .stoppersContainer") 

    if (tabName == 'personalLoan'){
        stoppersContainer.innerHTML = " "
        const plist = [1,2,3,4,5,6,7,8]
        plist.map((x,y)=>stoppersContainer.innerHTML += `<span class="stopper">${x}</span>`)
        tenureSlider.min = 1
        tenureSlider.max = 8
    }
    else {
        stoppersContainer.innerHTML = " "
        const plist = [1,5,10,15,20,25,30]
        plist.map((x,y)=>stoppersContainer.innerHTML += `<span class="stopper">${x}</span>`)
        tenureSlider.min = 1
        tenureSlider.max = 30
    }



    }
  
  // Initialize default tab on page load
  document.addEventListener("DOMContentLoaded", () => {
    showTab("homeLoan");
  });
  


