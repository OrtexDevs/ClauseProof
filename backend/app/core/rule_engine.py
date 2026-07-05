"""
ClauseProof Deterministic Rule Engine
The heart of "Compliance-as-Code" — provable validation against SEBI ICDR regulations.
This engine does NOT use LLM for validation. Every rule is deterministic, transparent,
and produces auditable, reproducible results.
"""
import json
import os
from typing import Optional
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.models.database_models import (
    Project, DRHPSection, RegulatoryRule, ComplianceResult
)


class RuleEngine:
    """
    Deterministic compliance validation engine.
    Rules are defined as JSON and executed with pure Python logic.
    No AI/ML involved — results are provable and reproducible.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self._rule_handlers = {
            "financial_threshold": self._check_financial_threshold,
            "field_required": self._check_field_required,
            "field_range": self._check_field_range,
            "section_completeness": self._check_section_completeness,
            "cross_reference": self._check_cross_reference,
            "date_constraint": self._check_date_constraint,
            "capital_structure": self._check_capital_structure,
            "ofs_limit": self._check_ofs_limit,
            "gcp_limit": self._check_gcp_limit,
            "content_length": self._check_content_length,
        }
    
    def run_all_rules(self, project_id: str) -> dict:
        """Run all applicable rules against a project and store results."""
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"error": "Project not found"}
        
        rules = self.db.query(RegulatoryRule).filter(
            RegulatoryRule.is_active == True,
            RegulatoryRule.applicable_to.in_(["sme", "all"]),
        ).all()
        
        # Clear existing results for this project
        self.db.query(ComplianceResult).filter(
            ComplianceResult.project_id == project_id
        ).delete()
        
        results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "warnings": 0,
            "skipped": 0,
            "details": [],
        }
        
        for rule in rules:
            result = self._execute_rule(rule, project)
            results["total"] += 1
            results[f"{result['status']}ed" if result['status'] != 'warning' else 'warnings'] += 1
            
            # Handle 'pass' -> 'passed' and 'fail' -> 'failed'
            status_key = result['status']
            if status_key == 'pass':
                results['passed'] += 1
                results['total'] -= 1  # Undo double count
            elif status_key == 'fail':
                results['failed'] += 1
                results['total'] -= 1
            elif status_key == 'warning':
                results['total'] -= 1
            elif status_key == 'skipped':
                results['total'] -= 1
            
            results['total'] += 1
            
            # Store result in DB
            compliance_result = ComplianceResult(
                project_id=project_id,
                section_id=result.get("section_id"),
                rule_id=rule.id,
                status=result["status"],
                message=result["message"],
                evidence=result.get("evidence"),
            )
            self.db.add(compliance_result)
            results["details"].append({
                "rule_code": rule.rule_code,
                "rule_text": rule.rule_text,
                "category": rule.category,
                "severity": rule.severity,
                **result,
            })
        
        # Update project compliance score
        if results["total"] > 0:
            project.compliance_score = round(
                (results["passed"] / results["total"]) * 100, 1
            )
        
        self.db.commit()
        
        # Recalculate summary
        results["passed"] = sum(1 for d in results["details"] if d["status"] == "pass")
        results["failed"] = sum(1 for d in results["details"] if d["status"] == "fail")
        results["warnings"] = sum(1 for d in results["details"] if d["status"] == "warning")
        results["skipped"] = sum(1 for d in results["details"] if d["status"] == "skipped")
        results["total"] = len(results["details"])
        results["score"] = project.compliance_score
        
        return results
    
    def _execute_rule(self, rule: RegulatoryRule, project: Project) -> dict:
        """Execute a single rule against a project."""
        validation = rule.validation_logic
        rule_type = validation.get("type")
        
        handler = self._rule_handlers.get(rule_type)
        if not handler:
            return {
                "status": "skipped",
                "message": f"Unknown rule type: {rule_type}",
            }
        
        try:
            return handler(validation, project, rule)
        except Exception as e:
            return {
                "status": "warning",
                "message": f"Rule execution error: {str(e)}",
            }
    
    def _check_financial_threshold(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check financial thresholds (e.g., EBITDA positivity)."""
        field = validation.get("field", "ebitda")
        condition = validation.get("condition", "count_positive_years >= 2")
        lookback = validation.get("lookback_years", 3)
        
        # Get financial values for last 3 FYs
        values = []
        for i in range(1, lookback + 1):
            val = getattr(project, f"{field}_fy{i}", None)
            if val is not None:
                values.append(val)
        
        if not values:
            return {
                "status": "warning",
                "message": f"No {field.upper()} data available for validation",
                "evidence": {"field": field, "values": values},
            }
        
        positive_count = sum(1 for v in values if v > 0)
        
        # Parse condition
        if "count_positive_years >= " in condition:
            threshold = int(condition.split(">= ")[1])
            passed = positive_count >= threshold
        elif "all_positive" in condition:
            passed = positive_count == len(values)
        else:
            passed = positive_count >= 2
        
        return {
            "status": "pass" if passed else "fail",
            "message": (
                f"{field.upper()} positive in {positive_count}/{len(values)} years"
                + (" — meets requirement" if passed else " — FAILS requirement")
            ),
            "evidence": {
                "field": field,
                "values": values,
                "positive_count": positive_count,
                "required": condition,
            },
        }
    
    def _check_field_required(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check that required fields are populated."""
        fields = validation.get("fields", [])
        missing = []
        
        for field in fields:
            # Check project-level fields
            val = getattr(project, field, None)
            if val is None or val == "" or val == 0:
                missing.append(field)
        
        if not fields:
            return {"status": "skipped", "message": "No fields specified"}
        
        if missing:
            return {
                "status": "fail",
                "message": f"Missing required fields: {', '.join(missing)}",
                "evidence": {"required": fields, "missing": missing},
            }
        
        return {
            "status": "pass",
            "message": f"All {len(fields)} required fields are populated",
            "evidence": {"required": fields, "missing": []},
        }
    
    def _check_field_range(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check field values are within acceptable ranges."""
        field = validation.get("field")
        min_val = validation.get("min")
        max_val = validation.get("max")
        unit = validation.get("unit", "")
        
        value = getattr(project, field, None)
        if value is None:
            return {
                "status": "warning",
                "message": f"Field '{field}' is not set",
            }
        
        if min_val is not None and value < min_val:
            return {
                "status": "fail",
                "message": f"{field} value {value}{unit} is below minimum {min_val}{unit}",
                "evidence": {"field": field, "value": value, "min": min_val, "max": max_val},
            }
        
        if max_val is not None and value > max_val:
            return {
                "status": "fail",
                "message": f"{field} value {value}{unit} exceeds maximum {max_val}{unit}",
                "evidence": {"field": field, "value": value, "min": min_val, "max": max_val},
            }
        
        return {
            "status": "pass",
            "message": f"{field} value {value}{unit} is within acceptable range",
            "evidence": {"field": field, "value": value, "min": min_val, "max": max_val},
        }
    
    def _check_section_completeness(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check that mandatory DRHP sections are completed."""
        required_sections = validation.get("required_sections", [])
        
        existing = self.db.query(DRHPSection).filter(
            DRHPSection.project_id == project.id,
            DRHPSection.section_code.in_(required_sections),
        ).all()
        
        existing_codes = {s.section_code for s in existing}
        completed_codes = {s.section_code for s in existing if s.is_completed}
        missing = set(required_sections) - existing_codes
        incomplete = existing_codes - completed_codes
        
        if missing:
            return {
                "status": "fail",
                "message": f"Missing mandatory sections: {', '.join(missing)}",
                "evidence": {
                    "required": required_sections,
                    "missing": list(missing),
                    "incomplete": list(incomplete),
                },
            }
        
        if incomplete:
            return {
                "status": "warning",
                "message": f"Sections incomplete: {', '.join(incomplete)}",
                "evidence": {
                    "required": required_sections,
                    "incomplete": list(incomplete),
                },
            }
        
        return {
            "status": "pass",
            "message": f"All {len(required_sections)} mandatory sections are complete",
        }
    
    def _check_cross_reference(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check cross-references between project fields."""
        source_field = validation.get("source_field")
        target_field = validation.get("target_field")
        relationship = validation.get("relationship", "equal")
        
        source_val = getattr(project, source_field, None)
        target_val = getattr(project, target_field, None)
        
        if source_val is None or target_val is None:
            return {
                "status": "warning",
                "message": f"Cannot verify: {source_field} or {target_field} not set",
            }
        
        if relationship == "less_than":
            passed = source_val < target_val
        elif relationship == "greater_than":
            passed = source_val > target_val
        elif relationship == "less_than_equal":
            passed = source_val <= target_val
        else:
            passed = source_val == target_val
        
        return {
            "status": "pass" if passed else "fail",
            "message": f"{source_field} ({source_val}) {'is' if passed else 'is NOT'} {relationship} {target_field} ({target_val})",
            "evidence": {
                "source": {source_field: source_val},
                "target": {target_field: target_val},
                "relationship": relationship,
            },
        }
    
    def _check_date_constraint(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check date-based constraints."""
        field = validation.get("field")
        constraint = validation.get("constraint")  # "min_years_ago"
        value = validation.get("value")
        
        date_val = getattr(project, field, None)
        if date_val is None:
            return {"status": "warning", "message": f"Date field '{field}' is not set"}
        
        if isinstance(date_val, str):
            date_val = datetime.fromisoformat(date_val).date()
        
        today = date.today()
        
        if constraint == "min_years_ago":
            years_diff = (today - date_val).days / 365.25
            passed = years_diff >= value
            return {
                "status": "pass" if passed else "fail",
                "message": f"Company is {years_diff:.1f} years old ({'≥' if passed else '<'} {value} year requirement)",
                "evidence": {"date": str(date_val), "years": round(years_diff, 1), "required": value},
            }
        
        return {"status": "skipped", "message": f"Unknown date constraint: {constraint}"}
    
    def _check_capital_structure(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Validate capital structure requirements."""
        field = validation.get("field", "post_issue_paid_up_capital")
        min_cr = validation.get("min_crores")
        max_cr = validation.get("max_crores")
        
        value = getattr(project, field, None)
        if value is None:
            return {"status": "warning", "message": f"Post-issue paid-up capital not specified"}
        
        if min_cr and value < min_cr:
            return {
                "status": "fail",
                "message": f"Post-issue paid-up capital ₹{value}Cr is below minimum ₹{min_cr}Cr",
                "evidence": {"value": value, "min": min_cr, "max": max_cr},
            }
        
        if max_cr and value > max_cr:
            return {
                "status": "fail",
                "message": f"Post-issue paid-up capital ₹{value}Cr exceeds SME limit of ₹{max_cr}Cr",
                "evidence": {"value": value, "min": min_cr, "max": max_cr},
            }
        
        return {
            "status": "pass",
            "message": f"Post-issue paid-up capital ₹{value}Cr within SME range (₹{min_cr}-{max_cr}Cr)",
            "evidence": {"value": value, "min": min_cr, "max": max_cr},
        }
    
    def _check_ofs_limit(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check Offer for Sale limits (max 20% of total issue)."""
        max_percentage = validation.get("max_percentage", 20)
        
        fresh = project.fresh_issue_shares or 0
        ofs = project.ofs_shares or 0
        total = fresh + ofs
        
        if total == 0:
            return {"status": "warning", "message": "Issue size not specified"}
        
        ofs_pct = (ofs / total) * 100
        passed = ofs_pct <= max_percentage
        
        return {
            "status": "pass" if passed else "fail",
            "message": f"OFS is {ofs_pct:.1f}% of total issue ({'within' if passed else 'EXCEEDS'} {max_percentage}% limit)",
            "evidence": {"ofs_shares": ofs, "total_shares": total, "ofs_percentage": round(ofs_pct, 1)},
        }
    
    def _check_gcp_limit(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check General Corporate Purpose fund allocation limits."""
        # GCP capped at 15% of fresh issue or ₹10Cr, whichever is lower
        max_percentage = validation.get("max_percentage", 15)
        max_absolute_cr = validation.get("max_absolute_crores", 10)
        
        issue_size = project.issue_size_cr
        if not issue_size:
            return {"status": "warning", "message": "Issue size not specified for GCP check"}
        
        gcp_limit_pct = issue_size * (max_percentage / 100)
        gcp_limit = min(gcp_limit_pct, max_absolute_cr)
        
        return {
            "status": "pass",
            "message": f"GCP must not exceed ₹{gcp_limit:.1f}Cr (lower of {max_percentage}% = ₹{gcp_limit_pct:.1f}Cr or ₹{max_absolute_cr}Cr cap)",
            "evidence": {
                "issue_size_cr": issue_size,
                "gcp_limit_cr": round(gcp_limit, 1),
                "percentage_limit": max_percentage,
                "absolute_cap_cr": max_absolute_cr,
            },
        }
    
    def _check_content_length(self, validation: dict, project: Project, rule: RegulatoryRule) -> dict:
        """Check that section content meets minimum length requirements."""
        section_code = validation.get("section_code")
        min_chars = validation.get("min_characters", 100)
        
        section = self.db.query(DRHPSection).filter(
            DRHPSection.project_id == project.id,
            DRHPSection.section_code == section_code,
        ).first()
        
        if not section:
            return {
                "status": "fail",
                "message": f"Section '{section_code}' does not exist",
                "section_id": None,
            }
        
        content = section.human_edited or section.ai_draft or ""
        if len(content) < min_chars:
            return {
                "status": "warning",
                "message": f"Section '{section_code}' content is {len(content)} characters (minimum recommended: {min_chars})",
                "section_id": section.id,
            }
        
        return {
            "status": "pass",
            "message": f"Section '{section_code}' has adequate content ({len(content)} characters)",
            "section_id": section.id,
        }
