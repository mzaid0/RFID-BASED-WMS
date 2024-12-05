import Authenticate from "@/components/Auth/Authentication";
import CountChart from "@/components/Dashboard/CountChart";
import ParcelCards from "@/components/Dashboard/ParcelCards";
import QuickStats from "@/components/Dashboard/QuickStats";
import ReportChart from "@/components/Dashboard/ReportChart";
import StatisticChart from "@/components/Dashboard/StatisticChart";
import React from "react";

const Dashboard = () => {
  return (
    <>
      <Authenticate>
        <div className="flex flex-col gap-6 py-6">
          <ParcelCards />
          <div className=" flex flex-col lg:flex-row  gap-6 px-4 py-2">
            <CountChart />
            <StatisticChart />
            <QuickStats />
          </div>
          <div className="h-[500px] px-4">
            <ReportChart />
          </div>
        </div>
      </Authenticate>
    </>
  );
};
export default Dashboard;
