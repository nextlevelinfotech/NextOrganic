export class productsModel {
    // प्रडक्ट अपडेट गर्दा र चिन्नको लागि ID चाहिन्छ (सुरुमा 0 वा null राख्न सकिन्छ)
    Id: number = 0; 
    
    ProductName: string = '';
    Description: string = '';
    Price: number = 0;
    StockQuantity: number = 0;
    CategoryId: number = 0;
    ProductImage: string = '';
    ProductImages: any[] = [];


    DiscountPrice: number = 0;
    IsActive!: boolean;



    // ahile backend bata hataeko xa

    // SKU: string = '';
    // ShortDescription: string = '';
    // IsFeatured: boolean = true;
}