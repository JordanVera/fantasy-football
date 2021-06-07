const Program = {
  init () {
    this.weeklyPicksValidation();
    this.triggerBuyAlert();
    this.toggleActiveBullets();
  },

  weeklyPicksValidation() {
    const forms = document.querySelectorAll("#exampleModal form");
    
    let userRows = document.querySelectorAll(`table tr[id*="${window.user}"]`);
    userRows = Array.from(userRows).map(
      (row) => Array.from(row.children)
        .slice(1)
        .map((cell) => cell.innerHTML.trim())
    );
    
    console.log("userRows", userRows);
    
    // const removedWeeks = forms.length;
    const removedWeeks = userRows[0].length - forms.length;

    console.log({
      removedWeeks,
    });
    
    // Form index is actually the  week index
    forms.forEach((form, formIndex) => {
      form.addEventListener("submit", (e) => {
        formIndex += removedWeeks;
    
        let valid = true;
        const errors = [];
        let errorMsg;
    
        const formGroups = form.querySelectorAll(".form-group");
        const removedGroups = userRows.length - formGroups.length;
        console.log({
          removedGroups,
        });
    
        form.querySelectorAll(".form-group").forEach((group, rowIndex) => {
          const selection = group.querySelector("select").value;
          console.log("selection for", rowIndex, selection);
          // ARI -> rowIndex
          // Gets the cells of the rest of the weeks (remove this one by comparing the index)
          const row = userRows[rowIndex].filter((c, index) => index !== formIndex);
          console.log("row", row);
    
          if (row.includes(selection)) {
            valid = false;
            errorMsg = `Selection ${selection} found in row number ${rowIndex + 1}`;
            errors.push(errorMsg);
            // throw error
          }
        });
    
        console.log({
          valid,
        });
    
        if (valid) return;
    
        e.preventDefault();
        console.log("errors", errors);
    
        swal(
          "You cannot pick the same team more than once:",
          `${errors.join("\n")}`
        );
      });
    });
  },

  triggerBuyAlert() {
    const eventsFired = localStorage.getItem("fired");
    const triggerOneTimeBuyInAlert = () => {
      document.addEventListener("DOMContentLoaded", (event) => {
        swal({
          title: " ",
          text: "Thank you for participating in nfllastlonger.com.  Good Luck!!!",
          className: "oneTimeAlert",
        });
      });
    };

    if (eventsFired != "1" && window.userBullets > 0) {
      triggerOneTimeBuyInAlert();
      localStorage.setItem("fired", "1");
    }
  },

  toggleActiveBullets () {
    // Toggle between active and all bullets
    window.addEventListener("load", function () {
      const $radioButtons = $('[name="active-bullets"]');
    
      $radioButtons.on("change", function () {
        const onlyActive = $(this).val() === "active-bullets";
        toggleRows(!onlyActive);
      });
    
      function toggleRows(hideNonActive) {
        $("table .bullet-loss").parent("tr").toggle(hideNonActive);
      }
    
      $radioButtons.eq(0).prop("checked", "checked");
    });
  }
};

Program.init();


