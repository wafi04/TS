"use client";
import { DialogChampionship } from "@/components/features/championship/components/DialogChampionship";
import Header from "@/components/features/championship/components/Header";
import { useUser } from "../../../hooks/useUser";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/infiniteScrollContainer";
import UiChampionship from "@/components/features/championship/components/UiChampionship";

export function Championship() {
  const { user, loading } = useUser();
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.championship.getKejuaraan,
    {},
    {
      initialNumItems: 9,
    }
  );

  return (
    <>
      {user && (
        <Header title="Championship">
          {user.role === "KETUA" && <DialogChampionship />}
        </Header>
      )}
      <InfiniteScrollContainer
        onBottomReached={() => loadMore(9)}
        number={9}
        className="grid grid-cols-3 gap-4 mt-2"
      >
        {results.map((cham) => (
          <UiChampionship championship={cham} key={cham._id} />
        ))}
      </InfiniteScrollContainer>
    </>
  );
}
