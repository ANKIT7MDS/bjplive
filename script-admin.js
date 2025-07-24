const API_URL = 'https://script.google.com/macros/s/AKfycbxZhcfU-fSRpFCgvqhAVUiSUJNquaaZNEY-3DbPF_d3dDQisATFcGLH5_kbN-iebqB0/exec'; // <-- यहां अपना Apps Script Web App URL पेस्ट करें

let table;

// डेटा लाने का फ़ंक्शन
function loadData() {
  const params = {
    'नाम': $('#fनाम').val().trim(),
    'मोबाइल नंबर': $('#fमोबाइल नंबर').val().trim()
  };

  console.log("Fetching with params:", params);

  $.getJSON(API_URL, params, data => {
    console.log("Fetched Data:", data);

    if (!data || data.length === 0) {
      alert("कोई डेटा नहीं मिला!");
      $('#admin-table').hide();
      return;
    }

    $('#admin-table').show();

    const headers = Object.keys(data[0]);

    if (!table) {
      $('#admin-table thead').html('<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>');

      table = $('#admin-table').DataTable({
        data: data,
        columns: headers.map(h => ({ data: h })),
        order: [[0, 'desc']],
        pageLength: 10,
        language: {
          emptyTable: "कोई डेटा उपलब्ध नहीं है"
        }
      });
    } else {
      table.clear();
      table.rows.add(data);
      table.draw();
    }
  }).fail(err => {
    console.error("Fetch Error:", err);
    alert("❌ डेटा लाने में त्रुटि हुई!");
  });
}

// CSV Export
function exportCSV() {
  if (!table) return alert("कोई डेटा नहीं!");

  const rows = table.rows({ search: 'applied' }).data().toArray();
  const headers = table.columns().header().toArray().map(h => h.innerText);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += headers.map(h => JSON.stringify(row[h] || '')).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'admin-data.csv';
  a.click();
}

$(document).ready(() => {
  $('#admin-table').hide();
  loadData();

  $('#refresh').click(() => {
    loadData();
  });

  $('#export').click(() => {
    exportCSV();
  });
});
