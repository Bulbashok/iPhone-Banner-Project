document.addEventListener("DOMContentLoaded", function () {
  const accessButtons = document.querySelectorAll(
    ".access-buttons-container .action-btn"
  );

  accessButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Сначала удаляем все активные классы
      accessButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.classList.add("inactive");
      });

      // Затем добавляем active только к текущей кнопке и удаляем inactive
      this.classList.add("active");
      this.classList.remove("inactive");
    });
  });
});
