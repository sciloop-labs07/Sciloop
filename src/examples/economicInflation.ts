import { baseGraph, type DemoDefinition } from "@/src/semantic/examples";

export const economicInflationDemo: DemoDefinition = {
  id: "economic-inflation",
  title: "Economic Inflation",
  summary: "Money tokens grow faster than goods, raising price level and shrinking purchasing power.",
  createGraph: () => {
    const graph = baseGraph(
      "economic-inflation",
      "Economic Inflation",
      "More money tokens chase limited goods; price level rises; purchasing power shrinks; behavior feeds back into velocity.",
    );
    graph.entities = [
      { id: "money_supply", label: "Money supply", type: "energy_source", position: { x: 0.15, y: 0.5 }, radius: 24 },
      { id: "consumer", label: "Consumers", type: "system", position: { x: 0.39, y: 0.5 }, radius: 24 },
      { id: "goods", label: "Goods/value", type: "value", position: { x: 0.63, y: 0.5 }, radius: 30 },
      { id: "price", label: "Price level", type: "output", position: { x: 0.84, y: 0.34 }, radius: 22 },
      { id: "power", label: "Purchasing power", type: "value", position: { x: 0.84, y: 0.72 }, radius: 22 },
    ];
    graph.variables = [
      { id: "money_growth", label: "Money Supply Growth", value: 0.68, min: 0, max: 1, step: 0.01 },
      { id: "goods_production", label: "Goods Production", value: 0.42, min: 0, max: 1, step: 0.01 },
      { id: "money_velocity", label: "Velocity of Money", value: 0.55, min: 0, max: 1, step: 0.01 },
    ];
    graph.flows = [
      { id: "money_flow", source: "money_supply", target: "consumer", type: "money", rate: 0.68, label: "money tokens" },
      { id: "spending_flow", source: "consumer", target: "goods", type: "money", rate: 0.55, label: "spending pressure" },
    ];
    graph.relations = [
      { id: "goods_to_price", from: "goods", to: "price", type: "growth", strength: 0.62, label: "prices respond" },
      { id: "price_to_power", from: "price", to: "power", type: "decay", strength: 0.62, label: "value shrinks" },
      { id: "feedback_velocity", from: "price", to: "consumer", type: "feedback", strength: 0.5, label: "behavior feedback" },
    ];
    graph.feedbackLoops = [
      { id: "inflation_loop", label: "Price pressure changes spending behavior", nodes: ["money_supply", "consumer", "goods", "price"], polarity: "amplifying", strength: 0.55 },
    ];
    graph.meta = {
      demoId: "economic-inflation",
      parserConfidence: 1,
      causalChain: ["Money supply grows", "Tokens chase goods", "Price level rises", "Purchasing power shrinks"],
    };
    return graph;
  },
};
