const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})

document.addEventListener('DOMContentLoaded', function() {
    const yearSelect = document.getElementById('signup-year');
    const monthSelect = document.getElementById('signup-month');
    const daySelect = document.getElementById('signup-day');
  
    // 日数を更新する関数
    function updateDays() {
      const year = parseInt(yearSelect.value);
      const month = parseInt(monthSelect.value);
      
      // 月ごとの日数（デフォルトは31日）
      let daysInMonth = 31;
  
      // 30日までの月
      if ([4, 6, 9, 11].includes(month)) {
        daysInMonth = 30;
      }
      // 2月は28日または29日
      else if (month === 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
          daysInMonth = 29; // 閏年
        } else {
          daysInMonth = 28;
        }
      }
  
      // 日数のオプションを更新
      daySelect.innerHTML = '<option value="">Day</option>'; // 初期化
      for (let day = 1; day <= daysInMonth; day++) {
        daySelect.innerHTML += `<option value="${day}">${day}</option>`;
      }
    }
  
    // 年と月が変更された時に日数を更新
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
  });
  