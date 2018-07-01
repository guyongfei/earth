export function extendMethod(sub, sup){
    let name;
    for(name in sup){
        let fn = sup[name];
        if(typeof fn == 'function' && sup.hasOwnProperty(name) && !sup.hasOwnProperty('hasOwnproperty')){
            sub[name] = fn;
        }
    }
}
