import React from 'react';
import { CarbonOffset } from '@/components/CarbonOffsets';
import CarbonRedeem from '@/Helpers/Redeem';

export default function Home() {
  return (
    <div>
      <CarbonRedeem />
      <CarbonOffset />
    </div>
  );
}
