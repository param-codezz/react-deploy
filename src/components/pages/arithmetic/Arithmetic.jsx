import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, X, Divide } from "lucide-react";
import AdditionTab from "./tabs/Addition";
import SubtractionTab from "./tabs/Subtraction";
import MultiplicationTab from "./tabs/Multiplication";
import DivisionTab from "./tabs/Division";
import BackButton from "@/components/ui/backButton";

export default function Arithmetic() {
  return (
    <div className="h-[calc(100vh-8em)] bg-background text-foreground p-2">
      <BackButton className="mb-4" />
      <div className="w-full max-w-6xl h-full mx-auto">
        <Tabs
          defaultValue="addition"
          direction="vertical"
          className="flex flex-row gap-6 h-full"
        >
          <TabsList className="flex flex-col h-full w-20 bg-card border border-border shadow-xl rounded-3xl p-2 space-y-1">
            <TabsTrigger
              value="addition"
              className="w-full h-16 rounded-2xl text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted hover:text-foreground flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="subtraction"
              className="w-full h-16 rounded-2xl text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted hover:text-foreground flex items-center justify-center"
            >
              <Minus className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="multiplication"
              className="w-full h-16 rounded-2xl text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted hover:text-foreground flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="division"
              className="w-full h-16 rounded-2xl text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted hover:text-foreground flex items-center justify-center"
            >
              <Divide className="w-6 h-6" />
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 h-full">
            <TabsContent value="addition" className="mt-0 h-full">
              <AdditionTab />
            </TabsContent>

            <TabsContent value="subtraction" className="mt-0 h-full">
              <SubtractionTab />
            </TabsContent>

            <TabsContent value="multiplication" className="mt-0 h-full">
              <MultiplicationTab />
            </TabsContent>

            <TabsContent value="division" className="mt-0 h-full">
              <DivisionTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
