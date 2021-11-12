


import { Pagination } from "react-bootstrap"


const PaginationComponent  = ({link, numberOfPages, currentPage}: {link: string, numberOfPages: number, currentPage: number}): JSX.Element => {
    

    const restOfPagination = () => {
        
        let elements: any[] = [];
        console.log(numberOfPages)
        if( numberOfPages<5 ){
        
            for(let i=2; i <= numberOfPages-1; i++){
                elements.push(<Pagination.Item  key={i} active={currentPage===i} href={link+`&page=${i}`}>{i}</Pagination.Item>);
            }
            return elements;
        }
        else{
            
            if(currentPage<3 || numberOfPages===currentPage){
                
                
                for(let i=2; i <= 5; i++){
                    if(i===numberOfPages){
                        break
                    }

                    if(i===numberOfPages){
                        break
                    }
    
                    let className: string = '' 
                    if(i!==currentPage){
                        className = "hide-on-small-screens"
                    }

                    elements.push(<Pagination.Item className={className} key={i} active={currentPage===i} href={link+`&page=${i}`}>{i}</Pagination.Item>);
                }
                elements.push(<Pagination.Ellipsis />)

                return elements
            }

            elements.push(<Pagination.Ellipsis />)
            for(let i=currentPage; i <= currentPage+3; i++){
                
                if(i===numberOfPages){
                    break
                }

                if(i===numberOfPages){
                    break
                }

                let className: string = '' 
                if(i!==currentPage){
                    className = "hide-on-small-screens"
                }

                elements.push(<Pagination.Item key={i} className={className} active={currentPage===i} href={link+`&page=${i}`}>{i}</Pagination.Item>);
                
            }
            elements.push(<Pagination.Ellipsis className="show-on-small-screens" />)
            
            return elements

        }

        
    }
  

    return (
        <div className="footer">
            <Pagination >
                <Pagination.First disabled={currentPage===1} href={link+`&page=${1}`} />
                <Pagination.Prev disabled={currentPage===1} href={link+`&page=${currentPage-1}`} />
                <Pagination.Item active={currentPage===1}  href={link+`&page=${1}`}>{1}</Pagination.Item>
         

                    {restOfPagination()}

                <Pagination.Item hidden={numberOfPages===1} active={currentPage===numberOfPages}  href={link+`&page=${numberOfPages}`}>{numberOfPages}</Pagination.Item>
                <Pagination.Next disabled={currentPage===numberOfPages} href={link+`&page=${currentPage-1}`} />
                <Pagination.Last disabled={currentPage===numberOfPages} href={link+`&page=${20}`} />
            </Pagination>
        </div>
    )      
}

export default PaginationComponent