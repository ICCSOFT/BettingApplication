// import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './betapp.service';
import { MatchesComponent } from './matches/matches.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { BetslipComponent } from './betslip/betslip.component';


const routes: Routes = [
    {path: '', redirectTo: '/matches', pathMatch:'full'},
    {path: 'registerpage', component: RegisterpageComponent},
    {path: 'betslip', component: BetslipComponent,canActivate: [AuthGuard]},
    {path: 'matches', component: MatchesComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [RegisterpageComponent, MatchesComponent,BetslipComponent]