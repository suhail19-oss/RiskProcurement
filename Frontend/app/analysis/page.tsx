"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { use, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"
import Esg from "@/components/analysis/esg"
import Cost from "@/components/analysis/cost"
import Risk from "@/components/analysis/risk"
import Reliability from "@/components/analysis/reliability"
import { Chatbot } from "@/components/chatbot"

const tabConfig = [
  {
    value: "ESG",
    title: "ESG Factor Analysis & Supplier Ranking",
    description: "Comprehensive Environmental, Social & Governance evaluation with intelligent supplier recommendations",
    gradient: "from-[#E2142D] via-[#2563eb] to-[#a21caf]"
  },
  {
    value: "Risk",
    title: "Risk Analysis",
    description: "Comprehensive risk evaluation of the supplier",
    gradient: "from-[#2563eb] via-[#a21caf] to-[#E2142D]"
  },
  {
    value: "Cost Efficiency",
    title: "Cost Efficiency Factor Analysis",
    description: "Comprehensive cost efficiency evaluation",
    gradient: "from-[#a21caf] via-[#E2142D] to-[#2563eb]"
  },
  {
    value: "Reliability",
    title: "Reliability Analysis",
    description: "Comprehensive reliability evaluation of the supplier",
    gradient: "from-[#10b981] via-[#2563eb] to-[#a21caf]"
  }
];

const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const email = userData.email ; 
const role = userData.role ; 

export default function analysis( ){
    const [activeTab, setActiveTab] = useState("ESG") ; 
    const currentTab = tabConfig.find(tab => tab.value === activeTab) || tabConfig[0] ; 
    const [supplier , setSupplier ] = useState("") ; 
    const [suppliers , setSuppliers] = useState([]) ;
    const [userRole, setUserRole] = useState("");
    const [userEmail, setUserEmail] = useState("");


    // Initialize user data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            setUserRole(userData.role || "");
            setUserEmail(userData.email || "");
        }
    }, []);

    // Fetch data based on user role
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userRole === "Supplier" && userEmail) {
                    // For suppliers: get company from email domain
                    const domain = userEmail.split('@')[1];
                    if (!domain) {
                        throw new Error("Invalid email format");
                    }

                    const response = await fetch(
                        `http://localhost:8000/company_name?email_domain=${encodeURIComponent(domain)}`
                    );
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to fetch company");
                    }

                    const data = await response.json();
                    setSupplier(data.company_name);
                } else {
                    // For non-suppliers: get all suppliers
                    const response = await fetch("http://localhost:8000/api/suppliers");
                    if (!response.ok) {
                        throw new Error("Failed to fetch suppliers");
                    }
                    const data = await response.json();
                    setSuppliers(data.suppliers || []);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
            }
        };

        if (userRole) { // Only fetch when user role is determined
            fetchData();
        }
    }, [userRole, userEmail]);

    // fetching all suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            const res = await fetch("http://localhost:8000/api/suppliers");
            const data = await res.json();
            console.log("Fetched suppliers:", data.suppliers);
            setSuppliers(data.suppliers);
        };

    fetchSuppliers();
    }, []);
    
    return( 
        <div className="relative pt-20 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            
            <div className="container mx-auto p-6 space-y-8">
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4"
                key={activeTab} // Important for animation between tabs
                >
                <h1 className={`text-4xl font-bold bg-gradient-to-r ${currentTab.gradient} bg-clip-text text-transparent animate-gradient`}>
                    <span className={`bg-gradient-to-r ${currentTab.gradient} bg-clip-text text-transparent animate-gradient-text`}>
                    {currentTab.title}
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    {currentTab.description}
                </p>
                </motion.div>

                { userRole !== "Supplier" && ( 
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <Select value={supplier} onValueChange={setSupplier}>
                        <SelectTrigger className="w-64 transition-all duration-300 hover:shadow-lg">
                        <SelectValue placeholder="Select a supplier">
                            {supplier || "Select a supplier"}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                        {suppliers.map((supplier : any ) => (
                            <SelectItem
                            key={`${supplier.company_name}_${Math.random()}`}
                            value={String(supplier.company_name)}
                            >
                            {supplier.company_name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </motion.div>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-10 ">
                <TabsList className="w-full  overflow-x-auto whitespace-nowrap flex gap-2 sm:justify-center">
                    <TabsTrigger value="ESG" className=" px-4 py-2 text-sm sm:text-base">
                    ESG
                    </TabsTrigger>
                    <TabsTrigger value="Risk" className="px-4 py-2 text-sm sm:text-base">
                    Risk
                    </TabsTrigger>
                    <TabsTrigger value="Cost Efficiency" className="px-4 py-2 text-sm sm:text-base">
                    Cost Efficiency
                    </TabsTrigger>
                    <TabsTrigger value="Reliability" className="px-4 py-2 text-sm sm:text-base">
                    Reliability
                    </TabsTrigger>
                </TabsList>
                </Tabs>
                
                { activeTab === "ESG" && <Esg supplier={supplier} /> }
                { activeTab === "Cost Efficiency" && <Cost supplier={supplier} /> }
                { activeTab === "Risk" && <Risk supplier={supplier} /> }
                { activeTab === "Reliability" && <Reliability supplier={supplier} /> }
            
            </div>
            <Chatbot />
        </div>
    )
}