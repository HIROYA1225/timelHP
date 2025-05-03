import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Lucideアイコンの初期化
  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  } else {
    console.warn("Lucide icons not initialized: lucide is not defined.")
  }

  // チャートの初期化
  initLineChart()
  initBarChart()
  initColumnChart()
  initDonutChart("donutChart75", 75, "#5155c3")
  initDonutChart("donutChart70", 70, "#f97316", "#5155c3")

  // レスポンシブサイドバーの設定
  setupResponsiveSidebar()

  // ウィンドウリサイズ処理
  window.addEventListener("resize", () => {
    // リサイズハンドラのデバウンス
    clearTimeout(window.resizeTimer)
    window.resizeTimer = setTimeout(handleResize, 100)
  })

  // リコメンド
  const btn = document.querySelector('.recommendation__button');
  btn.addEventListener('click', () => {
    // ここでモーダル開いたりリンク遷移したりしてな
    alert('「view more」がクリックされたで！');
  });

  // 初期リサイズ処理
  handleResize()
})

// ラインチャート
function initLineChart() {
  const ctx = document.getElementById("lineChart").getContext("2d")

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Blue",
          data: [10, 15, 8, 12, 20, 18, 15, 22, 25, 18, 22, 20],
          borderColor: "#5155c3",
          backgroundColor: "rgba(81, 85, 195, 0.1)",
          tension: 0.4,
          fill: false,
          pointRadius: 0,
        },
        {
          label: "Orange",
          data: [5, 10, 15, 12, 8, 10, 17, 15, 10, 12, 8, 10],
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          tension: 0.4,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 8,
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 9,
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
        },
        y: {
          display: true,
          beginAtZero: true,
        },
      },
    },
  })
}

// バーチャート
function initBarChart() {
  const ctx = document.getElementById("barChart").getContext("2d")

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Lorem",
          data: [65, 40, 80, 55],
          backgroundColor: "#5155c3",
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
        {
          label: "Ipsum",
          data: [45, 60, 35, 70],
          backgroundColor: "#8b5cf6",
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
        {
          label: "Dolor",
          data: [30, 50, 65, 40],
          backgroundColor: "#6366f1",
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
        {
          label: "Consectetur",
          data: [20, 30, 40, 25],
          backgroundColor: "#ec4899",
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 8,
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 9,
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          stacked: false,
        },
        y: {
          display: true,
          stacked: false,
          ticks: {
            font: {
              size: 9,
            },
          },
        },
      },
    },
  })
}

// カラムチャート
function initColumnChart() {
  const ctx = document.getElementById("columnChart").getContext("2d")

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Data",
          data: [30, 40, 25, 50, 30, 45],
          backgroundColor: "#f97316",
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          display: true,
          beginAtZero: true,
        },
      },
    },
  })
}

// ドーナツチャート
function initDonutChart(id, percentage, color, secondaryColor = "#e5e7eb") {
  const canvas = document.getElementById(id)
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Retina ディスプレイ対応
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const radius = Math.min(centerX, centerY) * 0.8

  // キャンバスをクリア
  ctx.clearRect(0, 0, rect.width, rect.height)

  // 背景円を描画
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.lineWidth = 8
  ctx.strokeStyle = secondaryColor
  ctx.stroke()

  // 進捗アークを描画
  const startAngle = -0.5 * Math.PI // 上から開始
  const endAngle = startAngle + (2 * Math.PI * percentage) / 100

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle)
  ctx.lineWidth = 8
  ctx.lineCap = "round"
  ctx.strokeStyle = color
  ctx.stroke()
}

// レスポンシブサイドバーの設定
function setupResponsiveSidebar() {
  const sidebar = document.getElementById("sidebar")
  const menuToggle = document.getElementById("menuToggle")
  const closeSidebar = document.getElementById("closeSidebar")
  const overlay = document.getElementById("overlay")

  // メニュートグル
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
      overlay.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  }

  // サイドバーを閉じる
  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("active")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    })
  }

  // オーバーレイをクリックしたときにサイドバーを閉じる
  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    })
  }

  // ナビゲーションリンクをクリックしたときにモバイルでサイドバーを閉じる
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        sidebar.classList.remove("active")
        overlay.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  })
}

// ウィンドウリサイズ処理
function handleResize() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")

  // 画面サイズが768px以上の場合、モバイルメニューの状態をリセット
  if (window.innerWidth >= 768) {
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  // ドーナツチャートを再描画
  initDonutChart("donutChart75", 75, "#5155c3")
  initDonutChart("donutChart70", 70, "#f97316", "#5155c3")
}

var lucide
