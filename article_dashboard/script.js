let allData = [];
let currentPage = 1;
const itemsPerPage = 20;
let filterStartDate = null;
let filterEndDate = null;

const tableBody = document.getElementById('article-data');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput'); // Ambil input pencarian

// Fetch seluruh data sekali saja
function fetchAllData() {
    const url = `https://ai.oigetit.com/AI71/Articles`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            allData = data.result;
            totalPages = Math.ceil(allData.length / itemsPerPage);
            renderPage();
            updatePagination();
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fungsi untuk render halaman berdasarkan data yang difilter
function renderPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filter data berdasarkan tanggal dan pencarian
    const filteredData = allData.filter(article => {
        const articleDate = new Date(article.pubdate);
        const matchesDateFilter = filterStartDate && filterEndDate ?
            articleDate >= new Date(filterStartDate) &&
            articleDate <= new Date(filterEndDate) :
            true;

        const matchesSearchFilter = searchInput.value ?
            article.title.toLowerCase().includes(searchInput.value.toLowerCase()) :
            true;

        return matchesDateFilter && matchesSearchFilter;
    });

    // Ambil data untuk halaman saat ini
    const pageData = filteredData.slice(startIndex, endIndex);

    // Render data ke tabel
    let rows = '';
    pageData.forEach(article => {
        rows += `<tr>
            <td>${getSentimentIcon(article.happiness)}</td>
            <td>${article.title}</td>
            <td>${article.feed}</td>
            <td>${new Date(article.pubdate).toLocaleDateString()}</td>
        </tr>`;
    });

    tableBody.innerHTML = rows;
}

// Fungsi untuk mendapatkan ikon sentimen
function getSentimentIcon(happiness) {
    if (happiness > 0) {
        return '😊';
    } else if (happiness < 0) {
        return '😢';
    } else {
        return '😐';
    }
}

// Fungsi untuk memperbarui pagination
function updatePagination() {
    const totalPages = Math.ceil(allData.length / itemsPerPage);
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageItems = paginationContainer.querySelectorAll(
        '.page-item:not(#prevPageItem):not(#nextPageItem)'
    );
    pageItems.forEach(item => item.remove());

    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === currentPage) pageItem.classList.add('active');

        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.href = '#';
        pageLink.textContent = i;

        pageLink.addEventListener('click', () => {
            currentPage = i;
            renderPage();
            updatePagination();
        });

        pageItem.appendChild(pageLink);
        paginationContainer.insertBefore(pageItem, document.getElementById('nextPageItem'));
    }
}

// Event listeners untuk tombol Next dan Prev
document.getElementById('next').addEventListener('click', () => {
    const totalPages = Math.ceil(allData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
        updatePagination();
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
        updatePagination();
    }
});

// Event listeners untuk filter berdasarkan minggu dan bulan
document.getElementById('thisWeekBtn').addEventListener('click', function () {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    filterStartDate = lastWeek.toISOString().split('T')[0];
    filterEndDate = today.toISOString().split('T')[0];

    currentPage = 1;
    renderPage();
    updatePagination();
});

document.getElementById('thisMonthBtn').addEventListener('click', function () {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    filterStartDate = firstDayOfMonth.toISOString().split('T')[0];
    filterEndDate = today.toISOString().split('T')[0];

    currentPage = 1;
    renderPage();
    updatePagination();
});

// Toggle input tanggal
document.getElementById('chooseDateBtn').addEventListener('click', function () {
    const dateInputs = document.getElementById('dateInputs');
    dateInputs.classList.toggle('d-none');
});

// Event listener untuk input pencarian
searchInput.addEventListener('input', function () {
    currentPage = 1;
    renderPage();
    updatePagination();
});

// Panggil fetchAllData saat halaman dimuat
fetchAllData();