import { UserDetailsService } from 'src/app/services/user-details.service';
import { HelperProvider } from 'src/app/services/helper.service';
import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vaultselected',
  templateUrl: './vaultselected.page.html',
  styleUrls: ['./vaultselected.page.scss'],
})
export class VaultselectedPage implements OnInit {

  liquorMainCategory : any = []; // liquore Main Category
  liquorCategory : any = []; // liquor Category
  categoryItems : any = [];
  selectedMainCategory : any = 0;

  constructor(
    private userDetails: UserDetailsService,
    private helper: HelperProvider,
    private _router: Router){
      this.addToCart = {carts: []};
  }

  ngOnInit() {
    this.getLiquorMainCategory(); // getting main Category
    this.getLiquorCategory(); // getting Liquor Category
  }

  getLiquorMainCategory(){
    this.userDetails.getLiquorMainCategory().subscribe(
      res => {
        this.liquorMainCategory = res;
        this.helper.dismissLoader();
      },
      err => {console.log(err),this.helper.dismissLoader();},
    )
  }

  getCategoryItem(id){
    this.userDetails.getLiquorItemsByCatgory(id).subscribe(
      res => {
        this.categoryItems = res;
        this.helper.dismissLoader();
      },
      err => {this.helper.dismissLoader();},
    )
  }

  getLiquorCategory(){
    this.userDetails.getLiquorList().subscribe(
      res => {
        this.liquorCategory = res;
        this.helper.dismissLoader();
      },
      err => {
        this.helper.dismissLoader();
      }
    );
  }

  public addToCart: {
    carts: CARTSITEM[];
  };

  public cartPrice = 0;
  public radioButtonSelect(categoryItem,valueSelected) {
    this.cartPrice = 0.00; // setting the Cart Price to be Zero
    this.addToCart.carts = this.addToCart.carts.filter(({ itemId }) => itemId !== categoryItem.id); // removing the Duplicasy or 0 selected from Local variable
    if(valueSelected != 0){
      let userId : any = 1;
      // store the Data Locally
      this.addToCart.carts.push({
        itemId : categoryItem.id,
        userId : userId,
        liquorCategoryId : categoryItem.liquorCategoryId,
        itemsCount : valueSelected,
        BigLiquorMaxPrice: categoryItem.BigLiquorMaxPrice,
        BigLiquorMinPrice : categoryItem.BigLiquorMinPrice,
        BigLiquorNormalPrice: categoryItem.BigLiquorNormalPrice,
        liquorCategory: categoryItem.liquorCategory,
        liquorShopId: categoryItem.liquorShopId,
        liquorName : categoryItem.liquorName,
      });
    }
    // retriving the price from cuttent array
    let calculatePrice = 0;
    this.addToCart.carts.forEach(function (value) {
      calculatePrice += parseFloat(value.itemsCount) * parseFloat(value.BigLiquorNormalPrice);
    });
    this.cartPrice = calculatePrice;
  }

  compareNDreview(){
    // deleting all cartItem for this User if Found Previously
    /*this.userDetails.deleteSelectedItemforUserFromCart().subscribe(
      res => {console.log(res)},
      err => {console.log(err)}
    );*/
    // Storing the data into cart
    /*this.addToCart.carts.forEach(function (value) {
      this.userDetails.addSelectedItemToCart(value).subscribe(
        res => {console.log(res)},
        err => {console.log(err)}
      );
    });*/
    
    // Storing the data Locally on v8 browser
    localStorage.setItem('cartsData',JSON.stringify(this.addToCart.carts));
    localStorage.setItem('cartsPrice',JSON.stringify(this.cartPrice));
    return this._router.navigate(['/vaultcompare']);
  }

}

interface CARTSITEM {
  itemId : string;
  userId : string;
  liquorCategoryId : string;
  itemsCount : string;
  BigLiquorMaxPrice : string;
  BigLiquorMinPrice: string;
  BigLiquorNormalPrice : string;
  liquorCategory : string;
  liquorShopId : string;
  liquorName: string;
}