const API_URL = 'https://script.google.com/macros/s/AKfycbxZhcfU-fSRpFCgvqhAVUiSUJNquaaZNEY-3DbPF_d3dDQisATFcGLH5_kbN-iebqB0/exec'; // <-- यहां अपना Apps Script Web App URL डालें

let table;

function loadData() {
  const naamVal = $('#fनाम').val() || '';
  const mobileVal = $('#fमोबाइल नंबर').val() || '';

  const params = {
    'नाम': naamVal.trim(),
    'मोबाइल नंबर': mobileVal.trim()
  };

  console.log("Fetching with:", params);

  $.getJSON(API_URL, params, data => {
    console.log("Fetched:", data);

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
        pageLength: 10,
        order: [[0, 'desc']]
      });
    } else {
      table.clear();
      table.rows.add(data);
      table.draw();
    }
  }).fail(err => {
    console.error("Fetch error:", err);
    alert("डेटा लाने में त्रुटि हुई!");
  });
}

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
  a.download = 'export.csv';
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
