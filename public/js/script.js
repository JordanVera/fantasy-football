/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const Program = {
  messages: {
    repeatedPick: 'You cannot pick the same team more than once:',
    succesfulBuyIn: 'Thank you for participating in nfllastlonger.com.  Good Luck!!!'
  },

  init() {
    this.events();
    this.weeklyPicksValidation();
    this.triggerBuyAlert();
  },

  events() {
    window.addEventListener('load', this.toggleActiveBullets);
  },

  weeklyPicksValidation() {
    const forms = document.querySelectorAll('#weekly-picks-modal form'); // Get all forms from weekly picks modal (there is 1 for each week)
    const _userRows = document.querySelectorAll(`table tr[class*="${window.user}"]`); // Get all user rows; remove first colummn
    const userRows = Array.from(_userRows).map(
      (row) =>
        // Convert HTML collection into array
        Array.from(row.children)
        // Remove first element (first row cell)
          .slice(1)
        // Map each cell into simple trimmed text
          .map((cell) => cell.innerHTML.trim())
    );

    console.log('userRows', userRows);

    if (!userRows.length) return;

    // const removedWeeks = forms.length;
    const removedWeeks = userRows[0].length - forms.length;

    console.log({
      removedWeeks,
    });

    forms.forEach((form, index) => {
      form.addEventListener('submit', event => this.submitPicks(event, form, index + removedWeeks, userRows));
    });
  },

  submitPicks(event, form, weekIndex, userRows) {
    const errors = [];
    const formGroups = form.querySelectorAll('.form-group');
    const removedGroups = userRows.length - formGroups.length;
    console.log({
      removedGroups,
    });

    const postSeasonWeeks = 22 - 18; // 18 + 4 == 22

    form.querySelectorAll('.form-group select').forEach((group, rowIndex) => {
      const selection = group.value;
      console.log('selection for', rowIndex, selection);

      // Gets the cells of the rest of the weeks; remove this week cell by comparing the index
      const row = userRows[rowIndex].filter((c, index) => index !== weekIndex);
      console.log('row', row);

      // Repeated selection
      const repeatedSelection = weekInddex + postSeasonWeeks < row.length
        ? row.slice(0, -postSeasonWeeks).includes(selection)
        : row.slice(-postSeasonWeeks).includes(selection);

      console.log('Group 1', row.slice(0, -postSeasonWeeks));
      console.log('Group 2', row.slice(-postSeasonWeeks));

      if (repeatedSelection) {
        valid = false;
        const errorMsg = `Selection ${selection} found in row number ${rowIndex + 1}`;
        errors.push(errorMsg);
      }
    });

    // Otherwise, prevent the form submit and show errors
    if (errors.length) {
      event.preventDefault();
      console.log('errors', errors);

      swal(
        this.messages.repeatedPick,
        `${errors.join('\n')}`
      );
    }
  },

  triggerBuyAlert() {
    const eventsFired = localStorage.getItem('fired');

    if (eventsFired === '1' || !(window.userBullets > 0)) return;

    const triggerOneTimeBuyInAlert = () => {
      document.addEventListener('DOMContentLoaded', (event) => {
        swal({
          title: ' ',
          text: this.messages.succesfulBuyIn,
          className: 'oneTimeAlert',
        });
      });
    };

    triggerOneTimeBuyInAlert();
    localStorage.setItem('fired', '1');
  },

  toggleActiveBullets () {
    function toggleRows(hideNonActive) {
      $('table .bullet-loss').parent('tr').toggle(hideNonActive);
    }

    // Toggle between active and all bullets
    const $radioButtons = $('[name="active-bullets"]');
    $radioButtons.eq(0).prop('checked', 'checked');

    $radioButtons.on('change', function () {
      const onlyActive = $(this).val() === 'active-bullets';
      toggleRows(!onlyActive);
    });
  }
};

Program.init();
