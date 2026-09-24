An award summary shows everything about one prime award: its amounts and dates, who funded it, which federal accounts paid for it, each transaction that changed it, and the subawards under it.

## Which ID to use

Award summary endpoints take `generated_unique_award_id`, the long ID search results return in `generated_internal_id`. Award IDs like a PIID or FAIN aren't unique on their own across agencies, so use the generated ID whenever you have it.

## Contracts, assistance, and IDVs

The page changes with the award type. Contracts and assistance awards share most calls. Indefinite delivery vehicles (IDVs) add calls for the orders placed under them and for amounts rolled up across those orders, which is why the IDV steps below are marked separately.
