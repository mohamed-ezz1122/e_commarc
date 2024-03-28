import { paginationFunction } from "../utils/pagination.js"


export class ApiFeatcher{
    constructor(query,mongooseQuery){
        //mongooseQuery=model.find()
        //query=req.query
        this.query=query
        this.mongooseQuery=mongooseQuery

    }
    pagination({page,size}){
        // const {page,size}=this.query
        const {limit,skip}= paginationFunction({page,size})
        // sort.replace('desc'&,-1)
      this.mongooseQuery.find().limit(limit).skip(skip)//.sort(sort)
      return this
      
    }
    sort(sort){
        const formela= sort.replace(/desc/g,-1).replace(/asc/g,1).replace(/ /g,":")
        const [key,value]= formela.split(':')
        this.mongooseQuery.find().sort({[key]:value}) 
        return this
    }
    search(search){
        const queryFilter={}
        if(search.title) queryFilter.title={$regex:search.title,$option:'i'}
        if(search.desc) queryFilter.desc={$regex:search.desc,$option:'i'}
        if(search.priceFrom && !search.priceTo) queryFilter.appliedPrice={$gte:search.priceFrom}
        if(search.priceTo && !search.priceFrom) queryFilter.appliedPrice={$lte:search.priceTo}
        if(search.priceTo && search.priceFrom) queryFilter.appliedPrice={$lte:search.priceTo,$gte:search.priceFrom}
        if(search.discount) queryFilter.discount={$ne:0}
        this.mongooseQuery=this.mongooseQuery.find(queryFilter)
        return this
    }
} 