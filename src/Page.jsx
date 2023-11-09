import React from 'react';
import PropertyFormComponent from './forms/PropertyFormComponent';
import RentFormComponent from './forms/RentFormComponent';
import FinishRentFormComponent from './forms/FinishRentFormComponent';
import SendReportFormComponent from './forms/SendReportFormComponent';
import PunishRenterFormComponent from './forms/PunishRenterFormComponent';
import PunishHirerFormComponent from './forms/PunishHirerFormComponent';

function Page() {
  return (
    <div className="page">
      <div className="column">
        <h2>Renter Operations</h2>
      <h3>Enter Property</h3>
      <PropertyFormComponent />

      <h3>Start Rent</h3>
      <RentFormComponent />
        </div>
      <div className="column">
      <h2>Member of Agreement Operations</h2>
      <h3>Finish Rent</h3>
      <FinishRentFormComponent />

      <h3>Send Report</h3>
      <SendReportFormComponent />
      </div>
      <div className="column">
      <h2>Admin Operations</h2>
      <h3>Punish Hirer</h3>
      <PunishHirerFormComponent />

      <h3>Punish Renter</h3>
      <PunishRenterFormComponent />
      </div>
    </div>
     
  );
}

export default Page;
