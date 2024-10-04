'use client';
import { CookingCostCalculatorComponent } from '../components/cooking-cost-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CookingCostCalculatorComponent />
    </main>
  );
}