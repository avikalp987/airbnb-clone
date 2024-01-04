import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import { SafeListing } from "./types";

export const dynamic = "force-dynamic"

interface HomeProps {
  searchParams: IListingsParams
}

const Home = async (
  { searchParams }: HomeProps
) => {

  //getting our listings from the action
  const listings = await getListings(searchParams)

  //getting out current user
  const currentUser = await getCurrentUser()

  //checking weather our listings are empty or not
  const isEmpty = listings.length===0

  //if we find no listings
  if(isEmpty)
  {
    return (
      <ClientOnly>
        <EmptyState 
          showReset
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((listing: SafeListing) => {
            return (
              <ListingCard 
                key={listing.id}
                data={listing}
                currentUser={currentUser}
              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )
}

export default Home
