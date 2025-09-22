import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface CropData {
  name: string;
  slotsPerSeed: number;
  yieldPerSeed: number;
  needed: number;
  seedsNeeded: number;
  slotsNeeded: number;
}

interface PlanterBox {
  boxNumber: number;
  crops: { name: string; seeds: number; slots: number }[];
  totalSlots: number;
  remainingSlots: number;
}

interface CalculationResult {
  crops: CropData[];
  purchaseItems: { name: string; quantity: number }[];
  planterBoxes: PlanterBox[];
  totalBoxesNeeded: number;
  canProduceWithBoxes: boolean;
  brineBarrels: { name: string; quantity: number }[];
  kimchiProduced: number;
  picklesProduced: number;
}

@Component({
  selector: 'app-foodstall-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './foodstall-calculator.component.html',
  styleUrl: './foodstall-calculator.component.scss'
})
export class FoodstallCalculatorComponent implements OnInit {
  hotdogsWanted: number = 1000;
  planterBoxesAvailable: number = 10;
  result: CalculationResult | null = null;

  ngOnInit() {
    this.calculate();
  }

  private readonly CROP_CONFIG = {
    carrot: { slotsPerSeed: 1, yieldPerSeed: 38 },
    radish: { slotsPerSeed: 1, yieldPerSeed: 25 },
    onion: { slotsPerSeed: 1, yieldPerSeed: 12 },
    garlic: { slotsPerSeed: 1, yieldPerSeed: 12 },
    cabbage: { slotsPerSeed: 4, yieldPerSeed: 6 },
    tomato: { slotsPerSeed: 4, yieldPerSeed: 25 },
    cucumber: { slotsPerSeed: 4, yieldPerSeed: 25 }
  };

  calculate() {
    if (this.hotdogsWanted <= 0) {
      this.result = null;
      return;
    }

    const radishNeeded = this.hotdogsWanted * 0.75; // 0.5 for slicing + 0.25 for kimchi
    const tomatoNeeded = this.hotdogsWanted * 0.25; // 0.25 for slicing
    const carrotNeeded = this.hotdogsWanted * 0.25; // for kimchi
    const cabbageNeeded = this.hotdogsWanted * (1/24); // for kimchi
    const cucumberNeeded = this.hotdogsWanted * (6/18); // for pickles
    const onionNeeded = this.hotdogsWanted * (1/18); // for pickles
    const garlicNeeded = this.hotdogsWanted * (1/18); // for pickles

    const crops: CropData[] = [
      this.calculateCrop('Radish', radishNeeded, this.CROP_CONFIG.radish),
      this.calculateCrop('Tomato', tomatoNeeded, this.CROP_CONFIG.tomato),
      this.calculateCrop('Carrot', carrotNeeded, this.CROP_CONFIG.carrot),
      this.calculateCrop('Cabbage', cabbageNeeded, this.CROP_CONFIG.cabbage),
      this.calculateCrop('Cucumber', cucumberNeeded, this.CROP_CONFIG.cucumber),
      this.calculateCrop('Onion', onionNeeded, this.CROP_CONFIG.onion),
      this.calculateCrop('Garlic', garlicNeeded, this.CROP_CONFIG.garlic)
    ];

    const planterBoxes = this.optimizePlanting(crops);

    // Calculate how many raw ingredients needed for brine barrels
    const kimchiBatchesNeeded = Math.ceil(this.hotdogsWanted / 24); // Need 1 kimchi per hotdog, each batch makes 24
    const picklesBatchesNeeded = Math.ceil(this.hotdogsWanted / 18); // Need 1 pickle per hotdog, each batch makes 18
    
    const radishForKimchi = kimchiBatchesNeeded * 6;
    const carrotForKimchi = kimchiBatchesNeeded * 6;
    const cabbageForKimchi = kimchiBatchesNeeded * 1;
    
    const cucumberForPickles = picklesBatchesNeeded * 6;
    const onionForPickles = picklesBatchesNeeded * 1;
    const garlicForPickles = picklesBatchesNeeded * 1;
    
    const kimchiProduced = kimchiBatchesNeeded * 24;
    const picklesProduced = picklesBatchesNeeded * 18;
    
    this.result = {
      crops,
      purchaseItems: [
        { name: 'Cheese', quantity: this.hotdogsWanted },
        { name: 'Sausage', quantity: this.hotdogsWanted }
      ],
      planterBoxes,
      totalBoxesNeeded: planterBoxes.length,
      canProduceWithBoxes: planterBoxes.length <= this.planterBoxesAvailable,
      brineBarrels: [
        { name: 'Radish (for kimchi)', quantity: radishForKimchi },
        { name: 'Carrot (for kimchi)', quantity: carrotForKimchi },
        { name: 'Cabbage (for kimchi)', quantity: cabbageForKimchi },
        { name: 'Cucumber (for pickles)', quantity: cucumberForPickles },
        { name: 'Onion (for pickles)', quantity: onionForPickles },
        { name: 'Garlic (for pickles)', quantity: garlicForPickles }
      ],
      kimchiProduced,
      picklesProduced
    };
  }

  private calculateCrop(name: string, needed: number, config: { slotsPerSeed: number; yieldPerSeed: number }): CropData {
    const seedsNeeded = Math.ceil(needed / config.yieldPerSeed);
    const slotsNeeded = seedsNeeded * config.slotsPerSeed;
    
    return {
      name,
      needed: Math.ceil(needed),
      seedsNeeded,
      slotsNeeded,
      slotsPerSeed: config.slotsPerSeed,
      yieldPerSeed: config.yieldPerSeed
    };
  }

  private optimizePlanting(crops: CropData[]): PlanterBox[] {
    const planterBoxes: PlanterBox[] = [];
    const remainingCrops = crops.map(crop => ({ ...crop })).filter(crop => crop.seedsNeeded > 0);

    let boxNumber = 1;
    
    // Process each crop individually to keep them together
    for (const crop of remainingCrops) {
      while (crop.seedsNeeded > 0) {
        // Try to find an existing box with enough space for this crop
        let targetBox = planterBoxes.find(box => 
          box.remainingSlots >= Math.min(crop.slotsNeeded, crop.seedsNeeded * crop.slotsPerSeed)
        );
        
        // If no existing box has space, create a new one
        if (!targetBox) {
          targetBox = {
            boxNumber: boxNumber++,
            crops: [],
            totalSlots: 64,
            remainingSlots: 64
          };
          planterBoxes.push(targetBox);
        }
        
        // Calculate how many seeds we can fit in this box
        const maxSeedsCanFit = Math.floor(targetBox.remainingSlots / crop.slotsPerSeed);
        const seedsToPlant = Math.min(crop.seedsNeeded, maxSeedsCanFit);
        const slotsUsed = seedsToPlant * crop.slotsPerSeed;
        
        // Add to existing crop entry or create new one
        const existingCrop = targetBox.crops.find(c => c.name === crop.name);
        if (existingCrop) {
          existingCrop.seeds += seedsToPlant;
          existingCrop.slots += slotsUsed;
        } else {
          targetBox.crops.push({
            name: crop.name,
            seeds: seedsToPlant,
            slots: slotsUsed
          });
        }
        
        targetBox.remainingSlots -= slotsUsed;
        crop.seedsNeeded -= seedsToPlant;
        crop.slotsNeeded -= slotsUsed;
      }
    }

    return planterBoxes;
  }
}
