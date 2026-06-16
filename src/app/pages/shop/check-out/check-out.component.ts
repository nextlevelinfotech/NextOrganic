import { AfterViewInit, Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
declare var jQuery: any;
@Component({
  selector: 'app-check-out',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './check-out.component.html',
})
export class CheckOutComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.checkAddressForm();
    this.toggle();
  }

  checkAddressForm() {
    $('#shipCheckbox').on('click', function () {
      $('.ship-address-form').slideToggle('500');
    });
  }

  toggle(): void {
    let selected: any = null;

    $(document).on('click', '.custom-radio', function () {
      const $this = $(this);
      const $currentCard = $this.closest('.payment-card');
      const $body = $currentCard.find('.payment-card-body');

      if (selected === this) {
        // Clicked the same radio again → uncheck and hide
        this.checked = false;
        selected = null;
        $body.stop().slideUp();
      } else {
        // Clicked a different radio → toggle current and hide others
        selected = this;

        // Uncheck all radios and check current
        $('.custom-radio').prop('checked', false);
        this.checked = true;

        // Slide up all other bodies except current
        $('.payment-card-body').not($body).stop().slideUp();

        // Slide toggle current body
        $body.stop().slideToggle();
      }
    });
  }
}
